export interface ImageUploadApiResponse {
    target: string // url or path
    uploader: string
    uploaderData: any
    error?: string
}

export abstract class ImageUploadStrategy {
    constructor(public readonly apiName: string) {}

    abstract uploadFile(file: Express.Multer.File): Promise<ImageUploadApiResponse>;

    abstract destroyFile(uploaderData: any): Promise<Omit<ImageUploadApiResponse, "uploaderData">>;
}
