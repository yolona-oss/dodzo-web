import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Category } from '@entities/category.entity';
import { Restaurant } from '@entities/restaurant/restaurant.entity';
import { Product } from '@entities/index';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { FileUploadModule } from 'modules/file-upload/file-upload.module';

@Module({
    imports: [
        MikroOrmModule.forFeature([Category, Restaurant, Product]),
        FileUploadModule
    ],
    providers: [
        CategoryService
    ],
    controllers: [
        CategoryController
    ],
    exports: [
        CategoryService
    ],
})
export class CategoryModule {}
