import { Module } from "@nestjs/common";
import { ImageProcessingService } from "./services/image-processing.service";
import { CloudinaryService } from "./services/cloudinary.service";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { ImageUploadController } from "./controllers/image-upload.controller";
import { ImageService } from "./services/image.service";

@Module({
    imports: [
        MikroOrmModule.forFeature([

        ])
    ],
    controllers: [
        ImageUploadController
    ],
    providers: [
        CloudinaryService,
        ImageProcessingService,
        ImageService
    ],
    exports: [
        CloudinaryService,
        ImageService
    ]
})
export class FileUploadModule { }
