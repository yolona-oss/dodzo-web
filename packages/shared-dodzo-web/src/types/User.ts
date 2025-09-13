import { Role } from "@/enums";

export interface IUser {
    id: string;
    username: string;
    firstName: string | null;
    lastName: string | null;
    phone?: string;
    email: string;
    emailVerified: boolean;
    password: string;
    images: string[]
    roles: Role[];
    tokens: string[];
    resetPasswordToken: string | null
    resetPasswordTokenExpiry: Date | null
    createdAt: Date;
    updatedAt: Date;
}
