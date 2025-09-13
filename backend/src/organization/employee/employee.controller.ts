import { Controller, Get, Put, Query, Res, Delete, Body, Post } from '@nestjs/common';
import { Response } from 'express';
import { UUIDValiationPipe } from './../../common/pipes/parse-object-id.pipe';

import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from '@dodzo-web/shared';

@Controller()
export class EmployeeController {
    constructor(
        private readonly employeeService: EmployeeService
    ) {}

    async findAll(@Res() res: Response) {
        const docs = await this.employeeService.findAll()
        res.status(200).json(docs)
    }

    @Get('/get-by-doc')
    async findById(
        @Query('id') id: string,
        @Res() res: Response
    ) {
        const doc = await this.employeeService.findById(id)
        res.status(200).json(doc)
    }

    @Get('/get-by-user')
    async findByUser(
        @Query('id', UUIDValiationPipe) id: string,
        @Res() res: Response
    ) {
        const doc = await this.employeeService.findByUserId(id)
        res.status(200).json(doc)
    }

    @Post('/create')
    async create(
        @Body() dto: CreateEmployeeDto,
        @Res() res: Response
    ) {
        const doc = await this.employeeService.create(dto)
        res.status(201).json(doc)
    }

    @Put('/assign-org')
    async asingOrgByUser(
        @Query('id', UUIDValiationPipe) id: string,
        @Query('orgId', UUIDValiationPipe) orgId: string,
        @Res() res: Response
    ) {
        const doc = await this.employeeService.asignOrgByUser(id, orgId)
        res.status(200).json(doc)
    }

    @Put('/assign-schedule')
    async asignSchedule(
        @Query('id', UUIDValiationPipe) id: string,
        @Query('schedule') schedule: any,
        @Res() res: Response
    ) {
        const doc = await this.employeeService.asignScheduleByUser(id, schedule)
        res.status(200).json(doc)
    }

    @Delete('/remove')
    async remove(
        @Query('id', UUIDValiationPipe) id: string,
        @Res() res: Response
    ) {
        await this.employeeService.remove(id)
        res.status(200)
    }

}
