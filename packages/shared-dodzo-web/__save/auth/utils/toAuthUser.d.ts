import { IAuthUser } from '../types/AuthUser';
export interface BaseUser {
    id: string;
    username: string;
    email: string;
    phone?: string;
    createdAt: Date;
    updatedAt: Date;
    roles: string[];
}
export declare const toAuthUser: (user: BaseUser) => IAuthUser;
//# sourceMappingURL=toAuthUser.d.ts.map