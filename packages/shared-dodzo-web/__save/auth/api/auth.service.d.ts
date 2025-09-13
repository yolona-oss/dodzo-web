import { CreateUserWithPasswordParams } from '../../types/CreateUserParams';
import type { IAuthSession } from '../types/AuthSession';
export declare const signIn: (credentials: {
    email: string;
    password: string;
}) => Promise<IAuthSession | null>;
export declare const signUp: (credentials: CreateUserWithPasswordParams) => Promise<IAuthSession | null>;
export declare const refreshToken: (token?: string) => Promise<IAuthSession>;
export declare const logout: () => Promise<void>;
//# sourceMappingURL=auth.service.d.ts.map