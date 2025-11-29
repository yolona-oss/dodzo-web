import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RestaurantDeco = createParamDecorator(
    (_: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return <string>request['restaurant_id'];
    },
);
