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
import { UUIDValiationPipe } from './../../../common/pipes/parse-object-id.pipe';
import { Response } from 'express'

import { ReviewsService } from './reviews/reviews.service';
import { ProductsService } from './products.service';

import { RequiredRoles } from './../../../common/decorators/role.decorator';

import { CreateProductDto, CreateProductReviewDto, PaginationDto, QueryProductDto, Role, UpdateProductDto } from '@dodzo-web/shared';

@Controller('products')
export class ProductsController {
    constructor(
        private readonly productsService: ProductsService,
        private readonly reviewsService: ReviewsService
    ) {}

    @Get('/')
    async findSome(@Query() query: QueryProductDto, @Res() response: Response) {
        const res = await this.productsService.findAll(query)
        return response.status(200).json(res)
    }

    @Get('/count')
    async productsCount(@Res() response: Response) {
        const count = await this.productsService.productsCount()
        response.status(200).json(count)
    }

    @RequiredRoles(Role.Admin)
    @Post('/create')
    async create(@Body() data: CreateProductDto, @Res() response: Response) {
        const res = await this.productsService.create(data)
        response.status(200).json(res)
    }

    @Get('/:id')
    async productById(@Param('id', UUIDValiationPipe) id: string, @Res() response: Response) {
        const doc = await this.productsService.findById(id)
        response.status(200).send(doc)
    }

    @Get('/:id/reviews')
    async productReviews(
        @Param('id', UUIDValiationPipe) id: string,
        @Query() query: PaginationDto,
        @Res() response: Response
    ) {
        const doc = await this.reviewsService.findProductReviews(id, query)
        response.status(200).json(doc)
    }

    @RequiredRoles(Role.User)
    @Post('/reviews/:id/add')
    async createProductReviews(
        @Param('id', UUIDValiationPipe) id: string,
        @Body() dto: CreateProductReviewDto,
        @Res() response: Response
    ) {
        if (id != dto.productId) {
            return response.status(400)
        }
        const execRes = await this.reviewsService.create(dto)
        return response.status(200).json(execRes)
    }

    @RequiredRoles(Role.Admin)
    @Delete('/:id')
    async removeProductById(
        @Param('id', UUIDValiationPipe) id: string,
        @Res() response: Response
    ) {
        const deleted = await this.productsService.remove(id)
        response.status(200).json(deleted)
    }

    @RequiredRoles(Role.Admin)
    @Put('/:id')
    async updateProductById(
        @Param('id', UUIDValiationPipe) id: string,
        @Body() dto: UpdateProductDto,
        @Res() response: Response
    ) {
        const execRes = await this.productsService.update(id, dto)
        response.status(200).json(execRes)
    }
}
