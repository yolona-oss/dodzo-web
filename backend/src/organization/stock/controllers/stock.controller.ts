import { Controller, Post, Patch, Get, Body, Param } from "@nestjs/common";
import { ProductStockService } from "./../services/stock.service";
import { CreateProductStockDto, UpdateProductStockDto } from "@dodzo-web/shared";

@Controller("stock")
export class ProductStockController {
    constructor(private readonly stockService: ProductStockService) {}

    @Post()
    create(@Body() dto: CreateProductStockDto) {
        return this.stockService.create(dto);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() dto: UpdateProductStockDto) {
        return this.stockService.update(id, dto);
    }

    @Get(":productId/:organizationId")
    getStock(
        @Param("productId") productId: string,
        @Param("organizationId") organizationId: string
    ) {
        return this.stockService.getStock(productId, organizationId);
    }
}
