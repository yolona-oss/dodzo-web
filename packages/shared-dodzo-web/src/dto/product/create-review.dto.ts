import { IsInt, IsString, Length, IsUUID, Max, Min } from 'class-validator';
export class CreateProductReviewDto {
    @IsUUID()
    productId: string;

    @IsUUID()
    customerId: string;

    @IsString()
    @Length(1, 2047)
    body: string;

    @IsInt()
    @Min(1)
    @Max(5)
    rating: number;
}
export class UpdateProductReviewDto extends CreateProductReviewDto {}
