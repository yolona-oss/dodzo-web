import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddressService } from './../services/address.service';
import { __RoleAll, CreateAddressDto } from '@dodzo-web/shared';
import { RequiredRoles } from 'common/decorators/role.decorator';

@Controller('addresse')
export class AddressController {
    constructor(private readonly addressService: AddressService) {}

    @RequiredRoles(...__RoleAll)
    @Post()
    create(@Body() dto: CreateAddressDto) {
        return this.addressService.create(dto);
    }

    @Get()
    findAll() {
        return this.addressService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.addressService.findOne(id);
    }
}
