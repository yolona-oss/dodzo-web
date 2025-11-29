import { AuthProvider } from "../dto/auth/enums/auth-provider.enum";
import { Role } from "./roles.type";

export interface IUser {
    id: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    passwordHash?: string;
    preferences?: Record<string, any>;
    roles: Role[];

    providers: AuthProvider[]
    googleId?: string;

    createdAt: Date;
    updatedAt: Date;
}
