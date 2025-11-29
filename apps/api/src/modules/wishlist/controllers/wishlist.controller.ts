import {
    Controller,
    Get,
    Put,
    Query,
    Res,
    Body
} from '@nestjs/common';
import { WishlistService } from './../services/wishlist.service';
import { Response } from 'express';

import { JwtAuthUser } from './../../../common/decorators/user.decorator';
import { RequiredRoles } from 'common/decorators/role.decorator';

import {
    JwtPayload,
    AddWishlistItemDto,
    RemoveWishlistItemDto,
    __RoleAll,
} from '@dodzo-web/shared';

@Controller('wishlist')
export class WishlistController {
    constructor(
        private readonly wishlistService: WishlistService
    ) {}

    @RequiredRoles(...__RoleAll)
    @Get('/')
    async getWishlist(
        @JwtAuthUser() user: JwtPayload,
        @Query('restaurant') restaurantId: string,
        @Res() response: Response
    ) {
        const wishlist = await this.wishlistService.getOrCreateDefaultWishlist(user.id, restaurantId)
        response.status(200).json(wishlist)
    }

    @RequiredRoles(...__RoleAll)
    @Put('/add')
    async addToWishlist(
        @JwtAuthUser() _: JwtPayload,
        @Body() dto: AddWishlistItemDto,
        @Res() response: Response
    ) {
        const wishlist = await this.wishlistService.addItem(dto)
        response.status(200).json(wishlist)
    }

    @RequiredRoles(...__RoleAll)
    @Put('/remove')
    async removeFromWishlist(
        @JwtAuthUser() _: JwtPayload,
        @Body() dto: RemoveWishlistItemDto,
        @Res() response: Response
    ) {
        const wishlist = await this.wishlistService.removeItem(dto)
        response.status(200).json(wishlist)
    }

    @RequiredRoles(...__RoleAll)
    @Put('/clear')
    async clearWishlist(
        @JwtAuthUser() user: JwtPayload,
        @Query('restaurant') restaurantId: string,
        @Res() response: Response
    ) {
        const wishlistId = (await this.wishlistService.getOrCreateDefaultWishlist(user.id, restaurantId)).id
        const wishlist = await this.wishlistService.clearWishlist(wishlistId)
        response.status(200).json(wishlist)
    }
}
