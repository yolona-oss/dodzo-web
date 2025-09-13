import { Controller, Get, Patch, Param, Body } from "@nestjs/common";
import { ProductStockSettingService } from "../services/stock-setting.service"; 
import { UpdateStockSettingDto } from "@dodzo-web/shared";

@Controller("stock-settings")
export class ProductStockSettingController {
    constructor(private readonly settingService: ProductStockSettingService) {}

    @Get(":orgId")
    get(@Param("orgId") orgId: string) {
        return this.settingService.getByOrg(orgId);
    }

    @Patch(":orgId")
    update(@Param("orgId") orgId: string, @Body() dto: UpdateStockSettingDto) {
        return this.settingService.update(orgId, dto);
    }
}
