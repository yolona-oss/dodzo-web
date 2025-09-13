import { Controller, Get, Put, Query, Res, Body } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { Response } from 'express';

import { JwtAuthUser } from './../../../common/decorators/user.decorator';
import { RequiredRoles } from 'common/decorators/role.decorator';

import { AddToWishlistDto,
    JwtPayload,
    RemoveFromWishlistDto,
    Role
} from '@dodzo-web/shared';

@Controller()
export class WishlistController {
    constructor(
        private readonly wishlistService: WishlistService
    ) {}

    @RequiredRoles(Role.Admin)
    @Get('/all')
    async findAll(
        @Res() response: Response,
        @Query('relations') relations?: string[],
    ) {
        const wls = await this.wishlistService.findAll(relations)
        response.status(200).json(wls)
    }

    @RequiredRoles(Role.User)
    @Get('/')
    async getWishlist(
        @JwtAuthUser() user: JwtPayload,
        @Res() response: Response
    ) {
        const wishlist = await this.wishlistService.findByCustomerId(user.customerId)
        response.status(200).json(wishlist)
    }

    // @RequiredRoles(Role.User)
    // @Get('/is-added')
    // async isContainsProduct(
    //     @AuthUser() user: JwtPayload,
    //     @Query('productId', UUIDValiationPipe) productId: string,
    //     @Res() response: Response
    // ) {
    //     const isAdded = await this.wishlistService.isContainsProduct(user.customerId, productId)
    //     response.status(200).json({isAdded: isAdded})
    // }

    @RequiredRoles(Role.User)
    @Put('/add')
    async addToWishlist(
        @JwtAuthUser() user: JwtPayload,
        @Body() dto: AddToWishlistDto,
        @Res() response: Response
    ) {
        const wishlist = await this.wishlistService.addItem(user.customerId, dto)
        response.status(200).json(wishlist)
    }

    @RequiredRoles(Role.User)
    @Put('/remove')
    async removeFromWishlist(
        @JwtAuthUser() user: JwtPayload,
        @Body() dto: RemoveFromWishlistDto,
        @Res() response: Response
    ) {
        const wishlist = await this.wishlistService.removeItem(user.customerId, dto)
        response.status(200).json(wishlist)
    }

    @RequiredRoles(Role.User)
    @Put('/clear')
    async clearWishlist(
        @JwtAuthUser() user: JwtPayload,
        @Res() response: Response
    ) {
        const wishlist = await this.wishlistService.clearWishlist(user.customerId)
        response.status(200).json(wishlist)
    }
}
