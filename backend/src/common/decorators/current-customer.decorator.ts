import { JwtPayload, REQUSET_USER_KEY } from '@dodzo-web/shared';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentCustomer = createParamDecorator(
    (_: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return (<JwtPayload>request[REQUSET_USER_KEY]).customerId;
    },
);
