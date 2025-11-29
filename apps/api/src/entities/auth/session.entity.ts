import { Entity, PrimaryKey, Property, ManyToOne, Enum } from '@mikro-orm/core';
import { v4 as uuid } from 'uuid';
import { User } from './user.entity';
import { TokenType } from '@dodzo-web/shared';

@Entity()
export class Session {
    @PrimaryKey({ type: 'uuid' })
    id: string = uuid();

    @ManyToOne(() => User, "sessions")
    user!: User;

    @Enum({ items: () => TokenType, default: TokenType.REFRESH })
    type = TokenType.REFRESH;

    // HASHED
    @Property()
    token!: string;

    @Property()
    deviceInfo!: string;

    @Property()
    ipAddress!: string;

    @Property()
    expiresAt!: Date;

    @Property()
    createdAt: Date = new Date();
}
