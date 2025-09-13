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

import { UUIDValiationPipe } from './../../../common/pipes/parse-object-id.pipe';
import { CategoryService } from './category.service';

import { CreateCategoryDto, UpdateCategoryDto } from '@dodzo-web/shared';

@Controller('category')
export class CategoryController {
    constructor(
        private categoryService: CategoryService,
    ) {}

    @Get('/')
    async findSome(@Query() query: any, @Res() response: Response) {
        const result = await this.categoryService.findPaginated(query)
        response.status(200).json(result)
    }

    @Post('/create')
    async createCategory(
        @Body() createDto: CreateCategoryDto,
        @Res() response: Response
    ) {
        const res = await this.categoryService.create(createDto)

        response.status(200).json(res);
    }

    @Get('/:id')
    async getCategoryById(@Param('id', UUIDValiationPipe) id: string, @Res() response: Response) {
        const category = await this.categoryService.findById(id)
        response.status(200).json(category)
    }

    @Delete('/:id')
    async removeById(@Param('id', UUIDValiationPipe) id: string, @Res() response: Response) {
        await this.categoryService.removeById(id);
        response.status(200)
    }

    @Put('/:id')
    async updateById(
        @Param('id', UUIDValiationPipe) id: string,
        @Body() updateDto: UpdateCategoryDto,
        @Res() response: Response
    ) {
        const updated = await this.categoryService.update(id, updateDto)
        response.status(200).json(updated);
    }
}

