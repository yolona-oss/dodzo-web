import { Role } from "@dodzo-web/shared";

export interface GenerateAccessTokenParams {
    userId: string;
    customerId: string;
    email: string;
    roles: Role[]
}
