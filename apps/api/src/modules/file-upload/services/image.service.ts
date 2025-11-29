import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { ImageProcessingService } from "./image-processing.service";
import { CloudinaryService } from "./cloudinary.service";
import { AttachImageDto, ImageTypeEnum, UploadImageDto } from "@dodzo-web/shared";
import { Image } from 'entities/image.entity'
import { ImageObj } from "entities/image.obj";
import { AppErrors } from "common/error";

@Injectable()
export class ImageService {
    constructor(
        private readonly em: EntityManager,
        private readonly imgProcessor: ImageProcessingService,
        private readonly cloudinary: CloudinaryService
    ) {}

    async upload(file: Express.Multer.File, dto: UploadImageDto) {
        const imageObj = await this.cloudinary.uploadImage(file);
        const image = new Image();
        image.image = {
            original: imageObj,
        };
        image.alt = dto.alt;
        await this.em.persistAndFlush(image);

        return image;
    }

    async streamUpload(file: Express.Multer.File, dto: UploadImageDto) {
        const imageObj = await this.cloudinary.uploadStream(file.stream, file.mimetype);
        if (!imageObj) {
            throw AppErrors.externalServiceUnavailable('Unable to upload image');
        }
        const image = new Image();
        image.image = {
            original: imageObj,
        };
        image.alt = dto.alt;
        await this.em.persistAndFlush(image);

        return image;
    }

    async uploadUserAvatar(file: Express.Multer.File, ownerId: string) {
        const imageObj = await this.imgProcessor.processUserAvatar(file);
        const image = new Image();

        image.image = imageObj;
        image.ownerType = ImageTypeEnum.User;
        image.ownerId = String(ownerId);

        await this.em.persistAndFlush(image);

        return image;
    }

    async uploadProductImage(file: Express.Multer.File, ownerId: string) {
        const imageObj = await this.imgProcessor.processProductImage(file);
        const image = new Image();

        image.image = imageObj;
        image.ownerType = ImageTypeEnum.Product;
        image.ownerId = String(ownerId);

        await this.em.persistAndFlush(image);

        return image;
    }

    async uploadBlankImage(file: Express.Multer.File, type: ImageTypeEnum) {
        let imageObj: ImageObj

        if (type === ImageTypeEnum.User) {
            imageObj = await this.imgProcessor.processUserAvatar(file);
        } else if (type === ImageTypeEnum.Product) {
            imageObj = await this.imgProcessor.processProductImage(file);
        } else {
            throw new Error('Invalid image type');
        }

        const image = new Image();

        image.image = imageObj;
        image.blankType = type;

        await this.em.persistAndFlush(image);

        return image;
    }

    async attachImage(imageId: string, dto: AttachImageDto) {
        const image = await this.em.findOne(Image, { id: imageId });
        if (!image) {
            throw AppErrors.dbEntityNotFound(`Image ${imageId} not found`)
        }
        image.ownerId = String(dto.ownerId);
        image.ownerType = dto.ownerType as ImageTypeEnum;
        await this.em.persistAndFlush(image);

        return image
    }

    async findAttachedImages(ownerType: ImageTypeEnum, ownerId: string) {
        return await this.em.find(Image, { ownerType, ownerId });
    }
}
