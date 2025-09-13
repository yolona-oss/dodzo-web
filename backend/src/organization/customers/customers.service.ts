import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerEntity } from 'common/entities/Customer.entity';

import { AppErrors } from 'common/app-error';
import { CreateCustomerDto, UpdateCustomerDeliveryAddressDto, UpdateCustomerDto } from '@dodzo-web/shared';
import { CartEntity } from 'common/entities/Cart.entity';
import { UserEntity } from 'common/entities/User.entity';
import { AddressBookEntity } from 'common/entities/AddressBook.entity';

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(CustomerEntity)
        private readonly customerRepo: Repository<CustomerEntity>,
        @InjectRepository(CartEntity)
        private readonly cartRepo: Repository<CartEntity>,
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
        @InjectRepository(AddressBookEntity)
        private readonly aBookRepo: Repository<AddressBookEntity>,
    ) {}

    async findAll(): Promise<CustomerEntity[]> {
        return await this.customerRepo.find()
    }

    async findById(id: string) {
        return await this.customerRepo.findOne({ where: { id } })
    }

    async findByUserId(userId: string) {
        const user_e = await this.userRepo.findOne({ where: { id: userId } })
        if (!user_e) {
            throw AppErrors.dbEntityNotFound("User not found")
        }

        return await this.customerRepo.findOne({
            where: { user: user_e },
            relations: {
                deliveryAddress: true,
            }
        })
    }

    async findWithRelations(cartId: string, relations: string[]): Promise<CustomerEntity> {
        const customer = await this.customerRepo.findOne({
            where: { id: cartId },
            relations,
        });

        if (!customer) {
            throw AppErrors.dbEntityNotFound("Customer not found");
        }

        return customer;
    }

    async create(dto: CreateCustomerDto): Promise<CustomerEntity> {
        const user_e = await this.userRepo.findOne({ where: { id: dto.userId } })
        if (!user_e) {
            throw AppErrors.dbCannotCreate("User not found")
        }

        // const existed_customer = await this.customerRepo.findOne({ where: { user: user_e } })
        // if (existed_customer) {
        //     throw AppErrors.dbCannotCreate(`Customer with user id ${user_e.id} already exists`)
        // }

        const customer_e = this.customerRepo.create({
            user: user_e,
        })

        return await this.customerRepo.save(customer_e)
    }

    async updateDeliveryAddress(customerId: string, dto: UpdateCustomerDeliveryAddressDto): Promise<CustomerEntity> {
        const customer = await this.findWithRelations(customerId, ['deliveryAddress', 'defaultAddressId']);

        const address_e = await this.aBookRepo.findOne({ where: { id: dto.addressId } })
        if (!address_e) {
            throw AppErrors.dbEntityNotFound("Delivery address not found")
        }

        customer.deliveryAddress = address_e

        return this.customerRepo.save(customer);
    }
}
