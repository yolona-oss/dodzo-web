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

import { RequiredRoles } from './../../common/decorators/role.decorator';
import { JwtAuthUser } from './../../common/decorators/user.decorator';

import {
    IAuthUser,
    UpdateUserDto,
    ChangePasswordDto,
    PaginationDto
} from '@dodzo-web/shared';

import { Role } from '@dodzo-web/shared';

@Controller('users')
export class UsersController {

    constructor(
        private userService: UserService
    ) {}

    @RequiredRoles(Role.Admin)
    @Get('/')
    async getAllUsers(
        @Res() response: Response,
        @Body() pagination: PaginationDto = {}
    ) {
        const docs = await this.userService.findAll(pagination)
        response.json(docs)
    }

    @RequiredRoles(Role.Admin)
    @Delete('/delete')
    async deleteUserById(
        @Query('userId') id: string,
        @Res() response: Response
    ) {
        const doc = await this.userService.remove(id)
        response.status(200).json(doc)
    }

    @RequiredRoles(Role.User)
    @Put('/')
    async updateUserById(
        @JwtAuthUser() user: IAuthUser,
        @Body() data: Partial<UpdateUserDto>,
        @Res() response: Response
    ) {
        const doc = await this.userService.updateSafe(user.id, data, data.password)
        response.status(200).json(doc)
    }

    @RequiredRoles(Role.User)
    @Put('/password')
    async changePassword(
        @JwtAuthUser() user: IAuthUser,
        @Body() data: ChangePasswordDto,
        @Res() response: Response
    ) {
        const { newPassword, oldPassword } = data
        const updatedUser = await this.userService.changePassword(user.id, oldPassword, newPassword)
        response.status(200).json(updatedUser)
    }

    @RequiredRoles(Role.User)
    @Get('/profile')
    async getUserById(
        @JwtAuthUser() user: IAuthUser,
        @Res() response: Response
    ) {
        const doc = await this.userService.findById(user.id)
        response.status(200).json(doc)
    }
}
