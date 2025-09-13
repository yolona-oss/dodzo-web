import {
    UseInterceptors,
    UploadedFiles,
    Param,
    Res,
    Get,
    Post,
    Delete,
    Controller,
    Query,
} from '@nestjs/common';
import { Response } from 'express'
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'

import { ImageUploadService } from './image-upload.service';

import { AppError, AppErrorTypeEnum } from './../app-error';
import { generateRandom, normalizeName } from './../misc/utils';

@Controller('images')
export class ImageUploadController {

    constructor(
        private readonly imageUploadService: ImageUploadService
    ) {}

    @Post('upload')
    @UseInterceptors(
        FilesInterceptor(
            "images", // body key
            20, // max files
            {
                storage: diskStorage({
                    destination: (_, __, cb) => cb(null, './images_uploads'),
                    filename: (_, file, cb) => cb(null, `${generateRandom()}_${normalizeName(file.originalname)}`)
                }),
                limits: {
                    fileSize: 1024 * 1024 * 10, // 10MB
                    files: 20
                },
                fileFilter: (_, file, cb) => {
                    if (!file.originalname.match(/\.(webm|jpg|jpeg|png|gif)$/)) {
                        return cb(new Error('Only image files are allowed!'), false)
                    }
                    cb(null, true)
                }
            }
        )
    )
    async upload(
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Res() res: Response
    ) {
        if (!files) {
            throw new AppError(AppErrorTypeEnum.CANNOT_UPLOAD_IMAGE, { message: "No files attached" })
        }

        const jsonRes = await this.imageUploadService.uploadImages(files);
        res.status(200).json(jsonRes)
    }

    @Get('/')
    async all(@Res() response: Response) {
        const entries = await this.imageUploadService.findAll()
        response.status(200).json(entries)
    }

    @Get('/id/:id')
    async get(@Param('id') id: string, @Res() response: Response) {
        const entry = await this.imageUploadService.findById(id)
        if (entry) {
            response.status(200).send(entry)
        }
        throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
    }

    @Delete('/:id')
    async remove(@Param('id') id: string, @Res() response: Response) {
        const execRes = await this.imageUploadService.remove(id)
        if (execRes) {
            return response.status(200)
        }
        throw new AppError(AppErrorTypeEnum.DB_ENTITY_NOT_FOUND)
    }
}
