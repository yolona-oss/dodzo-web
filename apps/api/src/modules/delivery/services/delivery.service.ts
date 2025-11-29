import { AssignDeliveryDto, CreateDeliveryDto, DeliveryStatus, DriverStatus, RateDeliveryDto, UpdateDeliveryStatusDto, UpdateDriverLocationDto } from "@dodzo-web/shared";
import { Delivery, DeliveryLocation, DeliveryStatusHistory, Driver, Order } from "@entities/index";
import { CreateRequestContext } from "@mikro-orm/core";
import { InjectRepository } from "@mikro-orm/nestjs";
import { EntityManager, EntityRepository } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { AppErrors } from "common/error";
import { calculateDistance } from "utils/math";

@Injectable()
export class DeliveryService {
    constructor(
        @InjectRepository(Delivery)
        private readonly deliveryRepo: EntityRepository<Delivery>,
        @InjectRepository(DeliveryLocation)
        private readonly locationRepo: EntityRepository<DeliveryLocation>,
        @InjectRepository(DeliveryStatusHistory)
        private readonly statusHistoryRepo: EntityRepository<DeliveryStatusHistory>,
        @InjectRepository(Driver)
        private readonly driverRepo: EntityRepository<Driver>,
        private readonly em: EntityManager,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    private async generateDeliveryNumber(): Promise<string> {
        const date = new Date();
        const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
        const count = await this.deliveryRepo.count({
            deliveryNumber: { $like: `DEL-${dateStr}%` },
        });
        return `DEL-${dateStr}-${String(count + 1).padStart(6, '0')}`;
    }

    @CreateRequestContext()
    async createDelivery(dto: CreateDeliveryDto): Promise<Delivery> {
        const order = await this.em.findOneOrFail(Order, dto.orderId);

        const deliveryNumber = await this.generateDeliveryNumber();

        const estimatedDistance = calculateDistance(
            dto.pickupLatitude,
            dto.pickupLongitude,
            dto.deliveryLatitude,
            dto.deliveryLongitude,
        );
        const estimatedDuration = Math.ceil(estimatedDistance * 3); // Rough estimate: 3 min per km

        const delivery = this.deliveryRepo.create({
            deliveryNumber,
            order,
            pickupAddress: dto.pickupAddress,
            pickupLatitude: dto.pickupLatitude,
            pickupLongitude: dto.pickupLongitude,
            deliveryAddress: dto.deliveryAddress,
            deliveryLatitude: dto.deliveryLatitude,
            deliveryLongitude: dto.deliveryLongitude,
            customerName: dto.customerName,
            customerPhone: dto.customerPhone,
            deliveryNotes: dto.deliveryNotes,
            deliveryFee: dto.deliveryFee,
            estimatedDistance,
            estimatedDuration,
            status: DeliveryStatus.PENDING,
        });

        await this.em.persistAndFlush(delivery);

        await this.addStatusHistory(delivery.id, DeliveryStatus.PENDING);

        this.eventEmitter.emit('delivery.created', { deliveryId: delivery.id });

        return delivery;
    }

    @CreateRequestContext()
    async assignDelivery(dto: AssignDeliveryDto): Promise<Delivery> {
        return this.em.transactional(async (em) => {
            const delivery = await this.deliveryRepo.findOneOrFail(dto.deliveryId);
            const driver = await this.driverRepo.findOneOrFail(dto.driverId);

            if (delivery.status !== DeliveryStatus.PENDING) {
                throw AppErrors.badRequest('Delivery is not in pending status');
            }

            if (driver.status !== DriverStatus.AVAILABLE) {
                throw AppErrors.courierNotAvailable('Driver is not available');
            }

            delivery.driver = driver;
            delivery.status = DeliveryStatus.ASSIGNED;
            delivery.assignedAt = new Date();
            delivery.estimatedDeliveryTime =
                dto.estimatedDeliveryTime ||
                    new Date(Date.now() + (delivery.estimatedDuration || 30) * 60000);

            driver.status = DriverStatus.BUSY;

            await em.flush();

            await this.addStatusHistory(
                delivery.id,
                DeliveryStatus.ASSIGNED,
                `Assigned to driver ${driver.id}`,
            );

            this.eventEmitter.emit('delivery.assigned', {
                deliveryId: delivery.id,
                driverId: driver.id,
            });

            return delivery;
        });
    }

    @CreateRequestContext()
    async updateDeliveryStatus(dto: UpdateDeliveryStatusDto): Promise<Delivery> {
        return this.em.transactional(async (em) => {
            const delivery = await this.deliveryRepo.findOneOrFail(
                dto.deliveryId,
                { populate: ['driver'] },
            );

            const oldStatus = delivery.status;
            delivery.status = dto.status;

            // Update timestamps based on status
            switch (dto.status) {
                case DeliveryStatus.ACCEPTED:
                    delivery.acceptedAt = new Date();
                    break;
                case DeliveryStatus.PICKED_UP:
                    delivery.pickedUpAt = new Date();
                    break;
                case DeliveryStatus.DELIVERED:
                    delivery.deliveredAt = new Date();
                    delivery.actualDeliveryTime = new Date();
                    delivery.proofOfDelivery = dto.proofOfDelivery;
                    if (delivery.driver) {
                        delivery.driver.status = DriverStatus.AVAILABLE;
                        delivery.driver.totalDeliveries += 1;
                    }
                    break;
                case DeliveryStatus.FAILED:
                    delivery.failureReason = dto.notes;
                    if (delivery.driver) {
                        delivery.driver.status = DriverStatus.AVAILABLE;
                    }
                    break;
                case DeliveryStatus.CANCELLED:
                    if (delivery.driver) {
                        delivery.driver.status = DriverStatus.AVAILABLE;
                    }
                    break;
            }

            await em.flush();

            await this.addStatusHistory(
                delivery.id,
                dto.status,
                dto.notes,
                dto.latitude,
                dto.longitude,
            );

            this.eventEmitter.emit('delivery.status.changed', {
                deliveryId: delivery.id,
                oldStatus,
                newStatus: dto.status,
                timestamp: new Date(),
            });

            return delivery;
        });
    }

    @CreateRequestContext()
    async trackDeliveryLocation(
        deliveryId: string,
        dto: UpdateDriverLocationDto,
    ): Promise<void> {
        const delivery = await this.deliveryRepo.findOneOrFail(deliveryId);

        // Save location to history
        const location = this.locationRepo.create({
            delivery,
            latitude: dto.latitude,
            longitude: dto.longitude,
            accuracy: dto.accuracy,
            speed: dto.speed,
            heading: dto.heading,
            altitude: dto.altitude,
            metadata: dto.metadata,
            timestamp: new Date(),
        });

        await this.em.persistAndFlush(location);

        this.eventEmitter.emit('delivery.location.updated', {
            deliveryId: delivery.id,
            orderId: delivery.order.id,
            latitude: dto.latitude,
            longitude: dto.longitude,
            speed: dto.speed,
            heading: dto.heading,
            timestamp: new Date(),
        });

        // Check if driver arrived at destination
        const distanceToDestination = calculateDistance(
            dto.latitude,
            dto.longitude,
            delivery.deliveryLatitude,
            delivery.deliveryLongitude,
        );

        if (
            distanceToDestination < 0.1 &&
                delivery.status === DeliveryStatus.IN_TRANSIT
        ) {
            await this.updateDeliveryStatus({
                deliveryId: delivery.id,
                status: DeliveryStatus.ARRIVED,
                latitude: dto.latitude,
                longitude: dto.longitude,
            });
        }
    }

    async getDeliveryTracking(deliveryId: string): Promise<{
        delivery: Delivery;
        currentLocation?: DeliveryLocation;
        estimatedTimeRemaining?: number;
        distanceRemaining?: number;
    }> {
        const delivery = await this.deliveryRepo.findOneOrFail(
            deliveryId,
            { populate: ['driver', 'order'] },
        );

        // Get latest location
        const currentLocation = await this.locationRepo.findOne(
            { delivery: deliveryId },
            { orderBy: { timestamp: 'DESC' } },
        );

        let estimatedTimeRemaining: number | undefined;
        let distanceRemaining: number | undefined;

        if (currentLocation && delivery.status === DeliveryStatus.IN_TRANSIT) {
            distanceRemaining = calculateDistance(
                currentLocation.latitude,
                currentLocation.longitude,
                delivery.deliveryLatitude,
                delivery.deliveryLongitude,
            );

            // Estimate time based on current speed or average speed
            const avgSpeed = currentLocation.speed || 30; // km/h
            estimatedTimeRemaining = Math.ceil((distanceRemaining / avgSpeed) * 60); // minutes
        }

        return {
            delivery,
            currentLocation: currentLocation || undefined, // work around of mikro-orm interface
            estimatedTimeRemaining,
            distanceRemaining,
        };
    }

    async getDeliveryLocationHistory(
        deliveryId: string,
    ): Promise<DeliveryLocation[]> {
        return this.locationRepo.find(
            { delivery: deliveryId },
            { orderBy: { timestamp: 'ASC' } },
        );
    }

    @CreateRequestContext()
    async rateDelivery(dto: RateDeliveryDto): Promise<Delivery> {
        return this.em.transactional(async (em) => {
            const delivery = await this.deliveryRepo.findOneOrFail(
                dto.deliveryId,
                { populate: ['driver'] },
            );

            if (delivery.status !== DeliveryStatus.DELIVERED) {
                throw AppErrors.badRequest('Delivery is not delivered yet');
            }

            delivery.rating = dto.rating;
            delivery.feedback = dto.feedback;

            // Update driver rating
            if (delivery.driver) {
                const driver = delivery.driver;
                const totalRating =
                    driver.rating * (driver.totalDeliveries - 1) + dto.rating;
                driver.rating = totalRating / driver.totalDeliveries;
            }

            await em.flush();
            return delivery;
        });
    }

    @CreateRequestContext()
    private async addStatusHistory(
        deliveryId: string,
        status: DeliveryStatus,
        notes?: string,
        latitude?: number,
        longitude?: number,
    ): Promise<void> {
        const delivery = await this.deliveryRepo.findOneOrFail(deliveryId);

        const history = this.statusHistoryRepo.create({
            delivery,
            status,
            notes,
            latitude,
            longitude,
            timestamp: new Date(),
        });

        await this.em.persistAndFlush(history);
    }

    async getDriverActiveDeliveries(driverId: string): Promise<Delivery[]> {
        return this.deliveryRepo.find(
            {
                driver: driverId,
                status: {
                    $in: [
                        DeliveryStatus.ASSIGNED,
                        DeliveryStatus.ACCEPTED,
                        DeliveryStatus.PICKED_UP,
                        DeliveryStatus.IN_TRANSIT,
                        DeliveryStatus.ARRIVED,
                    ],
                },
            },
            { populate: ['order'], orderBy: { assignedAt: 'ASC' } },
        );
    }
}

// // ==================== WEBSOCKET GATEWAY ====================
//
// import {
//     WebSocketGateway,
//     WebSocketServer,
//     SubscribeMessage,
//     OnGatewayConnection,
//     OnGatewayDisconnect,
//     ConnectedSocket,
//     MessageBody,
// } from '@nestjs/websockets';
// import { Server, Socket } from 'socket.io';
// import { OnEvent } from '@nestjs/event-emitter';
//
// @WebSocketGateway({
//   cors: {
//     origin: '*', // Configure properly in production
//   },
//   namespace: 'delivery',
// })
// export class DeliveryGateway
//   implements OnGatewayConnection, OnGatewayDisconnect
// {
//   @WebSocketServer()
//   server: Server;
//
//   private deliverySubscriptions = new Map<string, Set<string>>(); // deliveryId -> Set<socketId>
//   private driverSockets = new Map<string, string>(); // driverId -> socketId
//
//   handleConnection(client: Socket) {
//     console.log(`Client
