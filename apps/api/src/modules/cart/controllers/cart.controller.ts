import {
    Put,
    Get,
    Res,
    Controller,
    Body,
    Query,
} from '@nestjs/common';
import { Response } from 'express'

import { CartService } from './../services/cart.service';

import { JwtAuthUser } from './../../../common/decorators/user.decorator';
import {
    JwtPayload,
    AddCartItemDto,
    RemoveCartItemDto,
    UpdateCartItemDto,
    __RoleAll
} from '@dodzo-web/shared';
import { RequiredRoles } from 'common/decorators/role.decorator';

@Controller('cart')
export class CartController {
    constructor(
        private cartService: CartService
    ) {}

    @RequiredRoles(...__RoleAll)
    @Get('/')
    async getUserCart(
        @JwtAuthUser() user: JwtPayload,
        @Query('restaurant') restaurantId: string,
        @Res() res: Response
    ) {
        const cart = await this.cartService.getOrCreateCart(user.id, restaurantId)
        res.status(200).json(cart)
    }

    @RequiredRoles(...__RoleAll)
    @Get('/total')
    async totalCartPrice(
        @JwtAuthUser() user: JwtPayload,
        @Query('restaurant') restaurantId: string,
        @Res() res: Response
    ) {
        const cart = await this.cartService.getOrCreateCart(user.id, restaurantId)
        const total = await this.cartService.calculateCartTotal(cart.id)
        res.status(200).json(total)
    }

    @RequiredRoles(...__RoleAll)
    @Put('/add')
    async addItemToCart(
        @JwtAuthUser() _: JwtPayload,
        @Body() dto: AddCartItemDto,
        @Res() res: Response
    ) {
        const cart = await this.cartService.addItem(dto)
        res.status(200).json(cart)
    }

    @RequiredRoles(...__RoleAll)
    @Put('/remove')
    async removeItemFromCart(
        @JwtAuthUser() _: JwtPayload,
        @Body() dto: RemoveCartItemDto,
        @Res() res: Response
    ) {
        const cart = await this.cartService.removeItem(dto)
        res.status(200).json(cart)
    }

    @RequiredRoles(...__RoleAll)
    @Put('/update')
    async updateProductQuantity(
        @JwtAuthUser() _: JwtPayload,
        @Body() dto: UpdateCartItemDto,
        @Res() res: Response
    ) {
        const cart = await this.cartService.updateItem(dto)
        res.status(200).json(cart)
    }

    @RequiredRoles(...__RoleAll)
    @Put('/clear')
    async clearCart(
        @JwtAuthUser() user: JwtPayload,
        @Query('restaurant') restaurantId: string,
        @Res() response: Response
    ) {
        const cartId = (await this.cartService.getOrCreateCart(user.id, restaurantId)).id
        const cart = await this.cartService.clearCart(cartId)
        response.status(200).json(cart)
    }
}
