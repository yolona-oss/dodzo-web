import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductStockEntity } from "common/entities/ProductStock.entity";
import { ProductEntity } from "common/entities/Product.entity";
import { OrganizationEntity } from "common/entities/Organization.entity";
import { CreateProductStockDto, UpdateProductStockDto } from "@dodzo-web/shared";
import { StockUtils } from "../stock.utils";
import { ProductStockSettingService } from "./stock-setting.service";

@Injectable()
export class ProductStockService {
    constructor(
        @InjectRepository(ProductStockEntity)
        private readonly stockRepo: Repository<ProductStockEntity>,
        @InjectRepository(ProductEntity)
        private readonly productRepo: Repository<ProductEntity>,
        @InjectRepository(OrganizationEntity)
        private readonly orgRepo: Repository<OrganizationEntity>,
        private readonly settingService: ProductStockSettingService,
    ) {}

    async create(dto: CreateProductStockDto) {
        const product = await this.productRepo.findOneBy({ id: dto.productId });
        const organization = await this.orgRepo.findOneBy({ id: dto.organizationId });

        if (!product || !organization) {
            throw new NotFoundException("Product or Organization not found");
        }

        const stock = this.stockRepo.create({
            product,
            organization,
            count: dto.count,
            isInfinite: dto.isInfinite,
        });

        return this.stockRepo.save(stock);
    }

    async update(id: string, dto: UpdateProductStockDto) {
        const stock = await this.stockRepo.findOneBy({ id });
        if (!stock) throw new NotFoundException("Stock not found");

        Object.assign(stock, dto);
        return this.stockRepo.save(stock);
    }

    async getStock(productId: string, organizationId: string) {
        const stock = await this.stockRepo.findOne({
            where: { product: { id: productId }, organization: { id: organizationId } },
        });

        if (!stock) throw new NotFoundException("Stock not found");
        return stock;
    }

    async decreaseStock(productId: string, organizationId: string, quantity: number) {
        const stock = await this.getStock(productId, organizationId);
        const settings = await this.settingService.getByOrg(organizationId);

        const updated = StockUtils.decreaseStock(stock, quantity, settings);
        return this.stockRepo.save(updated);
    }

    async increaseStock(productId: string, organizationId: string, quantity: number) {
        const stock = await this.getStock(productId, organizationId);
        const updated = StockUtils.increaseStock(stock, quantity);
        return this.stockRepo.save(updated);
    }
}
