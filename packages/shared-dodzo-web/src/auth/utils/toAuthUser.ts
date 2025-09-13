import { IUser } from '@/types/User';
import { IAuthUser } from '../types/AuthUser';

export const toAuthUser = (user: IUser): IAuthUser => ({
    id: user.id,
    username: user.username,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    roles: user.roles,
});

