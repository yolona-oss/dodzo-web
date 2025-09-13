import { ConfigService } from "@nestjs/config";
import { unlinkSync } from "fs";
import { ImageUploadStrategy } from "../../misc/image-upload-strategy";
import { extractFileName } from "common/misc/utils";

export const LOCAL_IU_API_NAME = "local"

export class LocalUploadStrategy extends ImageUploadStrategy {
    constructor() {
        super(LOCAL_IU_API_NAME)
    }

    async uploadFile(file: Express.Multer.File) {
        const configService = new ConfigService();

        const server_url = configService.getOrThrow<string>("server_url")
        const server_port = configService.getOrThrow<number>("port")
        const static_path = configService.getOrThrow<string>("static_path")

        const path = 
            server_url + ":" + server_port + "/" + static_path
            + "/" +
            extractFileName(file.path, false)

        return {
            target: path,
            uploader: this.apiName,
            uploaderData: {
                localPath: file.path
            }
        }
    }

    async destroyFile(uploaderData: any) {
        let wrappedError = undefined
        try {
            unlinkSync(uploaderData.localPath)
        } catch(error: any) {
            wrappedError = JSON.stringify(error)
        }
        return {
            target: uploaderData.localPath,
            uploader: this.apiName,
            error: wrappedError
        }
    }
}
