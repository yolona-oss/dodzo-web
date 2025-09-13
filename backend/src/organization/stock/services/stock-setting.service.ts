import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductStockSettingEntity } from "common/entities/ProductStockSetting.entity";
import { UpdateStockSettingDto } from "@dodzo-web/shared"; 
import { OrganizationEntity } from "common/entities/Organization.entity";

@Injectable()
export class ProductStockSettingService {
    constructor(
        @InjectRepository(ProductStockSettingEntity)
        private readonly settingRepo: Repository<ProductStockSettingEntity>,
        @InjectRepository(OrganizationEntity)
        private readonly orgRepo: Repository<OrganizationEntity>,
    ) {}

    async getByOrg(orgId: string): Promise<ProductStockSettingEntity> {
        const setting = await this.settingRepo.findOne({
            where: { organization: { id: orgId } },
            relations: ["organization"],
        });
        if (!setting) throw new NotFoundException("Stock settings not found");
        return setting;
    }

    async update(orgId: string, dto: UpdateStockSettingDto): Promise<ProductStockSettingEntity> {
        let setting = await this.settingRepo.findOne({
            where: { organization: { id: orgId } },
        });

        if (!setting) {
            const organization = await this.orgRepo.findOneBy({ id: orgId });
            if (!organization) throw new NotFoundException("Organization not found");
            setting = this.settingRepo.create({ organization });
        }

        Object.assign(setting, dto);
        return this.settingRepo.save(setting);
    }
}
