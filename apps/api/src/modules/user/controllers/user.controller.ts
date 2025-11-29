import {
    Res,
    Query,
    Body,
    Controller,
    Get,
    Delete,
    Put,
} from '@nestjs/common';
import { Response } from 'express'

import { UserService } from "./../services/user.service";

import { RequiredRoles } from 'common/decorators/role.decorator';
import { JwtAuthUser } from 'common/decorators/user.decorator';

import {
    IAuthUser,
    UpdateUserDto,
    ChangePasswordDto,
    PaginationDto,
    __RoleAll
} from '@dodzo-web/shared';

import { Role } from '@dodzo-web/shared';

@Controller('users')
export class UsersController {

    constructor(
        private userService: UserService
    ) {}

    @RequiredRoles(Role.SUPER_ADMIN, Role.RESTAURANT_OWNER, Role.RESTAURANT_MANAGER)
    @Get('/')
    async getAllUsers(
        @Res() response: Response,
        @Body() pagination: PaginationDto = {}
    ) {
        const docs = await this.userService.findAll(pagination)
        response.json(docs)
    }

    // TODO: check if auth user of RESTAURANT_MANAGER is assigned to the same restaurant as the requested user
    @RequiredRoles(Role.SUPER_ADMIN, Role.RESTAURANT_MANAGER)
    @Delete('/delete')
    async deleteUserById(
        @Query('userId') id: string,
        @Res() response: Response
    ) {
        const doc = await this.userService.remove(id)
        response.status(200).json(doc)
    }

    @RequiredRoles(...__RoleAll)
    @Put('/')
    async updateUserById(
        @JwtAuthUser() user: IAuthUser,
        @Body() data: Partial<UpdateUserDto>,
        @Res() response: Response
    ) {
        const doc = await this.userService.updateSafe(user.id, data, data.password)
        response.status(200).json(doc)
    }

    @RequiredRoles(...__RoleAll)
    @Put('/password')
    async changePassword(
        @JwtAuthUser() user: IAuthUser,
        @Body() data: ChangePasswordDto,
        @Res() response: Response
    ) {
        const { newPassword, oldPassword } = data
        const updatedUser = await this.userService.updateSafe(user.id, { password: newPassword }, oldPassword)
        response.status(200).json(updatedUser)
    }

    @RequiredRoles(...__RoleAll)
    @Get('/profile')
    async getUserById(
        @JwtAuthUser() user: IAuthUser,
        @Res() response: Response
    ) {
        const doc = await this.userService.findById(user.id)
        response.status(200).json(doc)
    }
}
