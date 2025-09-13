import {
    Put,
    Body,
    Query,
    Param,
    Get,
    Res,
    Controller,
    Post,
} from '@nestjs/common';
import { Response } from 'express'

import { OrderService } from './orders.service';

import { JwtPayload, PaginationDto } from '@dodzo-web/shared';

import { JwtAuthUser } from './../../../common/decorators/user.decorator';

import { UUIDValiationPipe } from './../../../common/pipes/parse-object-id.pipe';

@Controller()
export class OrderController {
    constructor(
        private ordersService: OrderService
    ) {}

    @Get('/admin/all')
    async getAll(
        @Res() response: Response,
        @Body() dto: PaginationDto = {}
    ) {
        const ordersDocs = await this.ordersService.findAll(dto)
        response.status(200).json(ordersDocs)
    }

    @Get('/admin/:orderId')
    async getById(
        @Param('orderId', UUIDValiationPipe) id: string,
        @Res() response: Response
    ) {
        const orderDoc = await this.ordersService.findByIdWithDetails(id)
        response.status(200).json(orderDoc)
    }

    @Post('/create')
    async createOrder(
        @JwtAuthUser() user: JwtPayload,
        @Res() response: Response
    ) {
        const created = await this.ordersService.createFromCart(user.customerId)
        response.status(200).json(created)
    }
}
