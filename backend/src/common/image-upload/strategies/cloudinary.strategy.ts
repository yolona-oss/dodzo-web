import { ImageUploadApiResponse, ImageUploadStrategy } from "../../misc/image-upload-strategy";

import { v2 as cloudinary } from 'cloudinary';
import { AppError, AppErrorTypeEnum } from "common/app-error";
import { AppConfig } from "app.config";
import { CloudinaryResponse } from "../interfaces/cloudinary-responce.interface";

export const CLOUDINARY_IU_API_NAME = "cloudinary"

export class CloudinaryUploadStrategy extends ImageUploadStrategy {
    constructor(config: AppConfig) {
        super(CLOUDINARY_IU_API_NAME)

        cloudinary.config({
            cloud_name: config.cloudinary.resolve_name,
            api_key: config.cloudinary.api_key,
            api_secret: config.cloudinary.api_secret,
        })
    }

    async uploadFile(file: Express.Multer.File): Promise<ImageUploadApiResponse> {
        const file_path = file.path
        const options = {}

        try {
            const promise = new Promise((res, rej) => {
                cloudinary.uploader.upload(
                    file_path,
                    options,
                    (error, result) => {
                        if (error) {
                            rej(error)
                        }
                        res(<CloudinaryResponse>result)
                    }
                );
            })

            const res = <CloudinaryResponse>await promise

            return {
                target: res.secure_url,
                uploader: this.apiName,
                uploaderData: {
                    ...res
                }
            }
        } catch(error: any) {
            throw new AppError(AppErrorTypeEnum.CLOUDINARY_ERROR, { message: "Cloudinary upload error" })
        }
    }

    async destroyFile(data: any): Promise<Omit<ImageUploadApiResponse, "uploaderData">> {
        let wrappedError = undefined
        const public_id: string = data as string
        try {
            const promise = new Promise((res, rej) => {
                cloudinary.uploader.destroy(public_id, (error, result) => {
                    if (error) {
                        rej(error)
                    }
                    res(result)
                })
            })
            await promise
        } catch(error: any) {
            wrappedError = JSON.stringify(error)
        }

        return {
            target: public_id,
            uploader: this.apiName,
            error: wrappedError
        }
    }
}
