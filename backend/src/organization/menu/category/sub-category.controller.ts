import {
    Put,
    Delete,
    Param,
    Query,
    Body,
    Get,
    Res,
    Controller,
    Post,
} from '@nestjs/common';
import { Response } from 'express'

import { SubCategoryService } from './sub-category.service';

import { UUIDValiationPipe } from './../../../common/pipes/parse-object-id.pipe';
import { CreateSubCategoryDto, UpdateSubCategoryDto } from '@dodzo-web/shared';


@Controller('sub-category')
export class SubCategoryController {
    constructor(
        private subCategoryService: SubCategoryService
    ) {}

    @Get('/')
    async findSome(@Query() query: any, @Res() response: Response) {
        const result = await this.subCategoryService.findPaginated(query)
        response.status(200).json(result)
    }

    @Post('/create')
    async create(
        @Body() dto: CreateSubCategoryDto,
        @Res() response: Response
    ) {
        const res = await this.subCategoryService.create(dto)
        response.status(200).json(res);
    }

    @Get('/:id')
    async getById(
        @Param('id', UUIDValiationPipe) id: string,
        @Res() response: Response
    ) {
        const subCategory = await this.subCategoryService.findById(id)
        response.status(200).json(subCategory)
    }

    @Delete('/:id')
    async remove(
        @Param('id', UUIDValiationPipe) id: string,
        @Res() response: Response
    ) {
        await this.subCategoryService.removeById(id);
        response.status(200)
    }

    @Put('/:id')
    async updateById(
        @Param('id', UUIDValiationPipe) id: string,
        @Body() dto: UpdateSubCategoryDto,
        @Res() response: Response
    ) {
        const subCat = await this.subCategoryService.update(id, dto)
        response.status(200).json(subCat);
    }
}
