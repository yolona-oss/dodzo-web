import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAddressDto } from '@dodzo-web/shared'
import { AppError, AppErrorTypeEnum } from './../app-error';
import { AddressBookEntity } from 'common/entities/AddressBook.entity';

@Injectable()
export class AddressBookService {
    constructor(
        @InjectRepository(AddressBookEntity)
        private readonly aBookRepo: Repository<AddressBookEntity>,
    ) {}

    async findAll() {
        return await this.aBookRepo.find()
    }

    async findById(id: string) {
        return await this.aBookRepo.findOne({ where: { id } })
    }

    async updateLabel(id: string, label: string) {
        const res = await this.aBookRepo.update({ id }, { label })
        if (res.affected === 0) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
    }

    async updateAddress(id: string, address: Pick<CreateAddressDto, 'coordinates' | 'address'>) {
        const res = await this.aBookRepo.update({ id },
            { coordinates: address.coordinates, address: address.address }
        )
        if (res.affected === 0) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
    }

    async remove(id: string) {
        const entity = await this.findById(id)
        if (!entity) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        return await this.aBookRepo.remove(entity)
    }

    async create(dto: CreateAddressDto): Promise<AddressBookEntity> {
        const address = new AddressBookEntity()
        address.label = dto.label
        address.address = dto.address
        address.coordinates = dto.coordinates
        return await this.aBookRepo.save(address)
    }
}
