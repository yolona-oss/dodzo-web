import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CategoryService } from './../services/category.service';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    create(@Body() body: { name: string; description?: string; restaurantId: string }) {
        return this.categoryService.create(body);
    }

    @Get()
    findAll(@Query('restaurantId') restaurantId?: string) {
        return this.categoryService.findAll(restaurantId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.categoryService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() body: any) {
        return this.categoryService.update(id, body);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.categoryService.remove(id);
    }
}
