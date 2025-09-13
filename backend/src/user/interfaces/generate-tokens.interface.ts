import { Role } from "@dodzo-web/shared"

export interface GenerateTokensParams {
    userId: string
    customerId: string
    email: string
    roles: Role[]
}
