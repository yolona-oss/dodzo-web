import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { OrganizationEntity } from "./Organization.entity";
import { EntitiesEnum } from "common/enums/Entities.enum";

@Entity(EntitiesEnum.ProductStockSetting)
export class ProductStockSettingEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @OneToOne(() => OrganizationEntity, (org) => org.stockSetting, { onDelete: "CASCADE" })
    @JoinColumn()
    organization: OrganizationEntity;

    @Column({ type: "boolean", default: true })
    autoDecreaseOnOrder: boolean;

    @Column({ type: "boolean", default: false })
    allowNegativeStock: boolean;

    @Column({ type: "boolean", default: false })
    trackInfiniteStockSeparately: boolean;
}
