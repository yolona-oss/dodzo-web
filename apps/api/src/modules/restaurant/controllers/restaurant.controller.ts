import { Body, Controller, Get, Query, Req, Res } from "@nestjs/common";
import { RestaurantService } from "../services/restaurant.service";
import { Request, Response } from "express";
import { FindRestaurantDto, PaginationDto } from "@dodzo-web/shared";

@Controller('restaurant')
export class RestaurantController {
    constructor(
        private readonly restaurantService: RestaurantService
    ) {}

    @Get()
    async find(
        @Body() dto: FindRestaurantDto,
        @Req() _: Request,
        @Res() res: Response
        ) {
        const data = await this.restaurantService.find(dto)
        return res.status(200).json(data);
    }
}
