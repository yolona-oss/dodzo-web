import { Injectable } from '@nestjs/common';
import * as fs from 'fs'

import { AppError, AppErrorTypeEnum } from './../app-error';
import { extractFileName } from './../misc/utils';
import { DefaultImages, DefaultImagesType } from './../enums/default-images.enum';
import { BlankImagesPath } from './interfaces/blank-images-path.dto';
import { ImageUploadStrategy } from '../misc/image-upload-strategy';

// import { LocalUploadStrategy } from './strategies/local.strategy';
import { CloudinaryUploadStrategy } from './strategies/cloudinary.strategy';
import { AppConfig } from 'app.config';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from 'common/entities/Image.entity';
import { In, Repository } from 'typeorm';
import { CreateImageDto } from '@dodzo-web/shared';

@Injectable()
export class ImageUploadService {
    private readonly uploaders: ImageUploadStrategy[] = []
    private currentUploader: string = ""

    constructor(
        @InjectRepository(ImageEntity)
        private imageRepo: Repository<ImageEntity>,
        private readonly config: AppConfig
    ) {
        const imgUploadStrategy = new CloudinaryUploadStrategy(this.config)
        this.uploaders.push(
            imgUploadStrategy
        )
        this.currentUploader = imgUploadStrategy.apiName
    }

    async findById(id: string) {
        return await this.imageRepo.findOne({ where: { id } })
    }

    async findAll() {
        return await this.imageRepo.find()
    }

    async findBlank(type: DefaultImagesType) {
        return await this.imageRepo.findOne({ where: { blankType: DefaultImages[type] } })
    }

    private async removeEntityById(id: string) {
        const image_e = await this.findById(id)

        if (!image_e) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_DELETE, { message: `Image \"${id}\" not found` })
        }

        return await this.removeEntity(image_e)
    }

    private async removeEntity(image_e: ImageEntity) {
        return await this.imageRepo.remove(image_e)
    }

    private async create(dto: CreateImageDto) {
        const image_e = new ImageEntity()
        image_e.uploaderData = dto.uploaderData
        image_e.blankType = dto.blankType
        image_e.uploader = dto.uploader
        image_e.url = dto.url

        return await this.imageRepo.save(image_e)
    }

    private async uploadFile(file: Express.Multer.File) {
        const selectedUploader = this.uploaders.find(uploader => uploader.apiName === this.currentUploader)
        if (!selectedUploader) {
            throw new AppError(AppErrorTypeEnum.CANNOT_UPLOAD_IMAGE, { message: "Selected uploader not found" })
        }
        return await selectedUploader.uploadFile(file)
    }

    private async destroyFile(uploaderData: string, uploaderName: string = this.currentUploader) {
        const selectedUploader = this.uploaders.find(uploader => uploader.apiName === uploaderName)
        if (!selectedUploader) {
            throw new AppError(AppErrorTypeEnum.CANNOT_UPLOAD_IMAGE, { message: "Selected uploader not found" })
        }

        return await selectedUploader.destroyFile(uploaderData)
    }

    async uploadImages(files: Express.Multer.File[]) {
        const imageDocs = new Array<ImageEntity>;

        for (const file of files) {
            try {
                // upload
                const processed = await this.uploadFile(file)

                if (processed.error) {
                    fs.unlinkSync(file.path)
                    throw new AppError(AppErrorTypeEnum.CANNOT_UPLOAD_IMAGE, { message: processed.error })
                }

                imageDocs.push(
                    await this.create({
                        url: processed.target,
                        uploader: this.currentUploader,
                        uploaderData: processed.uploaderData,
                    })
                )
            } catch(e) {
                fs.unlinkSync(file.path)
                throw e
            } finally {
            } 
        }

        return imageDocs
    }

    // TODO verify
    async updateUrl(id: string, url: string) {
        const image_e = await this.findById(id)

        if (!image_e) {
            throw new AppError(AppErrorTypeEnum.DB_CANNOT_UPDATE, { message: `Image \"${id}\" not found` })
        }

        image_e.url = url

        return await this.imageRepo.save(image_e)
    }

    async remove(id: string) {
        const image_e = await this.findById(id)

        if (!image_e) {
            throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
        }
        await this.destroyFile(image_e.uploaderData, image_e.uploader)

        return await this.removeEntity(image_e)
    }

    async removeMany(ids: string[]) {
        // validate ids

        const images_e = await this.imageRepo.findBy({ id: In(ids) })

        for (let i = 0; i < images_e.length; ++i) {
            await this.remove(ids[i])
        }
    }

    async isImageUploaded(url: string): Promise<ImageEntity[]|null> {
        return await this.imageRepo.find({ where: { url } })
    }

    private async uploadDefaultBlack(file: { path: string, filename: string }, type: DefaultImagesType) {
        const processed = await this.uploadFile(file as Express.Multer.File)
        if (processed.error) {
            throw new AppError(AppErrorTypeEnum.CANNOT_UPLOAD_IMAGE, { message: processed.error })
        }
        console.log(file)
        console.log(processed)

        return await this.create({
            url: processed.target,
            uploader: this.currentUploader,
            uploaderData: processed.uploaderData,
            blankType: type
        })
    }

    async __createDefaultBlankImages(localPaths: BlankImagesPath[]): Promise<void> {
        for (const type in DefaultImages) {
            const isBlankExists = await this.imageRepo.find({ where: { blankType: type } })
            if (isBlankExists.length > 0) {
                continue
            }

            const fileToUpload = localPaths.filter(path => path.type == type).map(path => {
                return {
                    path: path.path,
                    filename: extractFileName(path.path, false)
                }
            })
            for (let i = 0; i < fileToUpload.length; ++i) {
                await this.uploadDefaultBlack(fileToUpload[i], type as DefaultImagesType)
            }
        }
    }
}
