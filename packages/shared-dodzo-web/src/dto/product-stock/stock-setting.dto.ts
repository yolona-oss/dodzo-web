import { IsBoolean, IsOptional } from "class-validator";

export class UpdateStockSettingDto {
    @IsOptional()
    @IsBoolean()
    autoDecreaseOnOrder?: boolean;

    @IsOptional()
    @IsBoolean()
    allowNegativeStock?: boolean;

    @IsOptional()
    @IsBoolean()
    trackInfiniteStockSeparately?: boolean;
}
