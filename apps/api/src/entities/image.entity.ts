import { ImageTypeEnum } from '@dodzo-web/shared';
import { Entity, PrimaryKey, Property, OptionalProps, t, Enum } from '@mikro-orm/core';
import { ImageObj } from 'entities/image.obj';

@Entity({ tableName: 'images' })
export class Image {
    [OptionalProps]?: 'altText' | 'order' | 'ownerType' | 'ownerId' | 'blankType' | 'createdAt' | 'updatedAt';

    @PrimaryKey({ type: 'uuid' })
    id: string;

    @Property({ type: 'json' })
    image: ImageObj;

    @Property({ nullable: true })
    alt?: string;

    @Property({ default: 0 })
    order: number;

    @Enum({ items: () => ImageTypeEnum, type: 'varchar' })
    @Property({ nullable: true })
    ownerType?: ImageTypeEnum;

    @Property({ nullable: true })
    ownerId?: string;

    @Enum({ items: () => ImageTypeEnum, type: 'varchar' })
    @Property({ nullable: true, unique: true })
    blankType?: ImageTypeEnum;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();
}
