import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";

import { AppError, AppErrors, AppErrorTypeEnum } from "./../common/app-error";

import { OrganizationEntity } from "common/entities/Organization.entity";

import {
    CreateOrganizationDto,
    UpdateOrganizationDto
} from "@dodzo-web/shared";
import { AddressBookEntity } from "common/entities/AddressBook.entity";
import { WeekScheduleEntity } from "common/entities/WeekSchedule.entity";

@Injectable()
export class OrganizationService {
    constructor(
        @InjectRepository(OrganizationEntity)
        private readonly orgRepo: Repository<OrganizationEntity>,

        @InjectRepository(AddressBookEntity)
        private readonly addressRepo: Repository<AddressBookEntity>,

        @InjectRepository(WeekScheduleEntity)
        private readonly scheduleRepo: Repository<WeekScheduleEntity>,
    ) {}

    async findAll() {
        return await this.orgRepo.find()
    }

    async findById(id: string) {
        return await this.orgRepo.findOne({ where: { id } })
    }

    async findByLabel(label: string) {
        return await this.orgRepo.findOne({ where: { label } })
    }

    async create(dto: CreateOrganizationDto): Promise<OrganizationEntity> {
        const address = await this.addressRepo.findOneBy({ id: dto.addressId })
        const schedule = await this.scheduleRepo.findOneBy({ id: dto.scheduleId })

        if (!address || !schedule) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }

        const org = this.orgRepo.create({
            label: dto.label,
            address,
            schedule,
            medianDeliveryTime: dto.medianDeliveryTime ?? 0,
            medianPickupTime: dto.medianPickupTime ?? 0,
            lastMedianDeliveryUpdateTime: new Date(),
            lastMedianPickupUpdateTime: new Date(),
        });

        return this.orgRepo.save(org);
    }

    async update(id: string, dto: UpdateOrganizationDto): Promise<OrganizationEntity> {
        const org = await this.findById(id);

        if (!org) {
            throw AppErrors.dbEntityNotFound("Organization not found");
        }

        if (dto.addressId) {
            const address = await this.addressRepo.findOneBy({ id: dto.addressId });
            if (!address) {
                throw AppErrors.dbEntityNotFound("Address not found");
            }
            org.address = address;
        }

        if (dto.scheduleId) {
            const schedule = await this.scheduleRepo.findOneBy({ id: dto.scheduleId });
            if (!schedule) {
                throw AppErrors.dbEntityNotFound("Schedule not found");
            }
            org.schedule = schedule;
        }

        Object.assign(org, dto);

        return this.orgRepo.save(org);
    }

    async remove(id: string): Promise<void> {
        const org = await this.findById(id);
        if (!org) {
            throw AppErrors.dbEntityNotFound("Organization not found");
        }
        await this.orgRepo.remove(org);
    }

    /***
    * @returns median delivery time in minutes
    */
    async calcRTMedianDeliveryTimeForDate(id: string, date: Date): Promise<number> {
        id;date;
        // const orders = await this.ordersService.findByOrgAndDay(id, date)
        //
        // let orderDeliveryDifference = new Array()
        // for (const order of orders) {
        //     const { creationData, closingData } = order
        //
        //     const diff = closingData!.getTime() - creationData.getTime()
        //     orderDeliveryDifference.push(diff)
        // }
        //
        // const totalOrders = orders.length
        // const medianDeliveryTime = orderDeliveryDifference.reduce((a, b) => a + b, 0) / totalOrders
        //
        // return medianDeliveryTime
        return 0
    }
}
