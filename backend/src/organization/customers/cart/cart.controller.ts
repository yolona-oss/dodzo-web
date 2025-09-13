import {
    Put,
    Get,
    Res,
    Controller,
    Body,
} from '@nestjs/common';
import { Response } from 'express'

import { CartService } from './cart.service';

import { JwtAuthUser } from './../../../common/decorators/user.decorator';
import { AddToCartDto, JwtPayload, RemoveFromCartDto, Role, UpdateCartDto } from '@dodzo-web/shared';
import { RequiredRoles } from 'common/decorators/role.decorator';

@Controller('cart')
export class CartController {
    constructor(
        private cartService: CartService
    ) {}

    @RequiredRoles(Role.Admin)
    @Get('/all')
    async getAllCarts(@Res() response: Response) {
        const docs = await this.cartService.findAll()
        response.status(200).json(docs)
    }

    @RequiredRoles(Role.User)
    @Get('/')
    async getUserCart(
        @JwtAuthUser() user: JwtPayload,
        @Res() response: Response
    ) {
        try {
            const cart = await this.cartService.findByCustomerId(user.customerId)
            response.status(200).json(cart)
        } catch(e) {
            console.error(e)
        }
    }

    @RequiredRoles(Role.User)
    @Get('/total')
    async totalCartPrice(
        @JwtAuthUser() user: JwtPayload,
        @Res() response: Response
    ) {
        const total = await this.cartService.totalCartPrice(user.customerId)
        response.status(200).json(total)
    }

    @RequiredRoles(Role.User)
    @Put('/add')
    async addItemToCart(
        @JwtAuthUser() user: JwtPayload,
        @Body() dto: AddToCartDto,
        @Res() response: Response
    ) {
        const cart = await this.cartService.addItem(user.id, dto)
        response.status(200).json(cart)
    }

    @RequiredRoles(Role.User)
    @Put('/remove')
    async removeItemFromCart(
        @JwtAuthUser() user: JwtPayload,
        @Body() dto: RemoveFromCartDto,
        @Res() response: Response
    ) {
        const cart = await this.cartService.removeItem(user.customerId, dto)
        response.status(200).json(cart)
    }

    @RequiredRoles(Role.User)
    @Put('/set-quantity')
    async updateProductQuantity(
        @JwtAuthUser() user: JwtPayload,
        @Body() dto: UpdateCartDto,
        @Res() response: Response
    ) {
        const cart = await this.cartService.updateItemQuantity(user.customerId, dto)
        response.status(200).json(cart)
    }

    @RequiredRoles(Role.User)
    @Put('/clear')
    async clearCart(
        @JwtAuthUser() user: JwtPayload,
        @Res() response: Response
    ) {
        const cart = await this.cartService.clearCart(user.customerId)
        response.status(200).json(cart)
    }
}
