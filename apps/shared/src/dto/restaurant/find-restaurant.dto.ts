import { PaginationDto } from "../common/pagination.dto";

export interface FindRestaurantDto {
    id?: string;
    name?: string;
    slug?: string;
    addressId?: string;
    scheduleId?: string;
    hasLounge?: boolean;
    hasDelivery?: boolean;
    deliverySettings?: string;
    timezone?: string;
    isActive?: boolean;
    pagination: PaginationDto
}
