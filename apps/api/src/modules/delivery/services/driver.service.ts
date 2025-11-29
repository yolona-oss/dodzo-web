import { Injectable } from '@nestjs/common';
import { CreateRequestContext, EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Driver, User } from '@entities/index';
import { CreateDriverDto, DriverStatus, GetNearbyDriversDto, UpdateDriverDto, UpdateDriverLocationDto } from '@dodzo-web/shared';
import { calculateDistance } from 'utils/math';
import { AppErrors } from 'common/error';

@Injectable()
export class DriverService {
    constructor(
        @InjectRepository(Driver)
        private readonly driverRepo: EntityRepository<Driver>,
        private readonly em: EntityManager,
        private readonly eventEmitter: EventEmitter2,
    ) {}

    @CreateRequestContext()
    async createDriver(dto: CreateDriverDto): Promise<Driver> {
        const user = await this.em.findOneOrFail(User, dto.userId);

        const existingDriver = await this.driverRepo.findOne({ user: dto.userId });
        if (existingDriver) {
            throw AppErrors.dbCannotCreate('Driver already exists');
        }

        const driver = this.driverRepo.create({
            user,
            vehicleType: dto.vehicleType,
            vehicleNumber: dto.vehicleNumber,
            vehicleModel: dto.vehicleModel,
            phoneNumber: dto.phoneNumber,
            status: DriverStatus.OFFLINE,
        });

        await this.em.persistAndFlush(driver);
        return driver;
    }

    async updateDriver(driverId: string, dto: UpdateDriverDto): Promise<Driver> {
        const driver = await this.driverRepo.findOneOrFail(driverId);

        if (dto.vehicleType) driver.vehicleType = dto.vehicleType;
        if (dto.vehicleNumber) driver.vehicleNumber = dto.vehicleNumber;
        if (dto.vehicleModel) driver.vehicleModel = dto.vehicleModel;
        if (dto.phoneNumber) driver.phoneNumber = dto.phoneNumber;
        if (dto.status) driver.status = dto.status;
        if (dto.isActive !== undefined) driver.isActive = dto.isActive;

        await this.em.flush();
        return driver;
    }

    async updateDriverLocation(dto: UpdateDriverLocationDto): Promise<void> {
        const driver = await this.driverRepo.findOneOrFail(dto.driverId);

        driver.currentLatitude = dto.latitude;
        driver.currentLongitude = dto.longitude;
        driver.lastLocationUpdate = new Date();

        if (!driver.metadata) {
            driver.metadata = {};
        }
        driver.metadata.lastLocation = {
            accuracy: dto.accuracy,
            speed: dto.speed,
            heading: dto.heading,
            altitude: dto.altitude,
            ...dto.metadata,
        };

        await this.em.flush();

        // Emit location update event for real-time tracking
        this.eventEmitter.emit('driver.location.updated', {
            driverId: driver.id,
            latitude: dto.latitude,
            longitude: dto.longitude,
            timestamp: new Date(),
        });
    }

    async getNearbyDrivers(dto: GetNearbyDriversDto): Promise<Driver[]> {
        const radiusKm = dto.radiusKm || 10;

        // PostGIS
        const drivers = await this.driverRepo.find({
            status: DriverStatus.AVAILABLE,
            isActive: true,
            currentLatitude: { $ne: null },
            currentLongitude: { $ne: null },
        });

        return drivers.filter((driver) => {
            const distance = calculateDistance(
                dto.latitude,
                dto.longitude,
                driver.currentLatitude!,
                driver.currentLongitude!,
            );
            return distance <= radiusKm;
        });
    }

    async updateDriverStatus(
        driverId: string,
        status: DriverStatus,
    ): Promise<Driver> {
        const driver = await this.driverRepo.findOneOrFail(driverId);
        driver.status = status;
        await this.em.flush();

        this.eventEmitter.emit('driver.status.changed', {
            driverId: driver.id,
            status,
            timestamp: new Date(),
        });

        return driver;
    }
}
