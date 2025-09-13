import { IAuthUser } from './AuthUser';

export interface IAuthSession {
    user: IAuthUser;
    access_token: string;
}
