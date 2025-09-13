import { Controller, Get, Put, Query, Res, Delete, Body, Post } from '@nestjs/common';
import { Response } from 'express';
import { CreateOrganizationDto } from '@dodzo-web/shared';

import { OrganizationService } from './org.service';

@Controller('org')
export class OrganizationController {
    constructor(
        private readonly orgService: OrganizationService
    ) {}

    @Get('/')
    async findAny(
        @Query() query: any,
        @Res() res: Response
    ) {
        if (query.id) {
            const doc = await this.orgService.findById(query.id)
            res.status(200).json(doc)
        // } else if (query.name) {
        //     const doc = await this.orgService.findByName(query.name)
        //     res.status(200).json(doc)
        } else {
            const docs = await this.orgService.findAll()
            res.status(200).json(docs)
        }
    }

    @Post('/create')
    async create(
        @Body() createOrgDto: CreateOrganizationDto,
        @Res() res: Response
    ) {
        const doc = await this.orgService.create(createOrgDto)
        res.status(201).json(doc)
    }

    @Delete('/remove')
    async remove(
        @Query('id') id: string,
        @Res() res: Response
    ) {
        const doc = await this.orgService.remove(id)
        res.status(200).json(doc)
    }

    @Put('/change-address')
    async changeAddress(
        // @Query('id') id: string,
        // @Body() address: string,
        // @Res() res: Response
    ) {
        // const doc = await this.orgService.(id, address)
        // res.status(200).json(doc)
    }

}
