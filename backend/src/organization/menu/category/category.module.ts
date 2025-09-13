import { Module } from '@nestjs/common';
import { ImageUploadModule } from './../../../common/image-upload/image-upload.module';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryService } from './sub-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'common/entities/Category.entity';
import { SubCategoryEntity } from 'common/entities/Subcategory.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([CategoryEntity, SubCategoryEntity]),
        ImageUploadModule,
    ],
    providers: [SubCategoryService, CategoryService],
    exports: [SubCategoryService, CategoryService],
    controllers: [CategoryController, SubCategoryController]
})
export class CategoryModule {}
