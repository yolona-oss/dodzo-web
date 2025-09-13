import { Module, OnApplicationBootstrap } from '@nestjs/common';
import path from 'path'

import { ImageUploadService } from './image-upload.service';

import { ImageUploadController } from './image-upload.controller';

import { DefaultImagesType } from './../enums/default-images.enum'
import { AppConfig } from 'app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageEntity } from 'common/entities/Image.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ImageEntity
        ]),
    ],
    providers: [ImageUploadService],
    controllers: [ImageUploadController],
    exports: [ImageUploadService]
})
export class ImageUploadModule implements OnApplicationBootstrap {
    constructor(
        private imagesService: ImageUploadService,
        private config: AppConfig 
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        // TODO create loop method
        const userImage = {
            path: path.join(__dirname, '..', '..', '..', '..', String(this.config.blankImages.user)),
            type: "User" as DefaultImagesType
        }
        const productImage = {
            path: path.join(__dirname, '..', '..', '..', '..', String(this.config.blankImages.product)),
            type: "Product" as DefaultImagesType
        }
        const categoryImage = {
            path: path.join(__dirname, '..', '..', '..', '..', String(this.config.blankImages.category)),
            type: "Category" as DefaultImagesType
        }
        await this.imagesService.__createDefaultBlankImages([userImage, productImage, categoryImage])
    }
}
