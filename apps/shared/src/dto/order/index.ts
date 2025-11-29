import { OrderType } from '../../types/order/order-type.type';

export class CreateOrderDto {
    restaurantId: string;
    orderType: OrderType;
    deliveryAddress?: string;
    estimatedDeliveryTime?: Date;
    notes?: string;
    items: Array<{
        productId: string;
        quantity: number;
        customizations?: Record<string, any>;
    }>;
}

export class ConvertCartToOrderDto {
    cartId: string;
    orderType: OrderType;
    deliveryAddress?: string;
    estimatedDeliveryTime?: Date;
    notes?: string;
}

export class UpdateOrderStatusDto {
    orderId: string;
    status: string; // pending, confirmed, preparing, ready, delivered, cancelled
    meta?: Record<string, any>;
    notes?: string;
}

export class CancelOrderDto {
    orderId: string;
    reason: string;
    refundStock?: boolean;
    itemsToCancel?: string[]; // OrderItem IDs, if null cancels entire order
}

export class OrderCalculationResult {
    subtotal: number;
    deliveryFee: number;
    total: number;
    items: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
    }>;
}

export class RefundOrderDto {
    orderId: string;
    reason: string;
    refundStock?: boolean;
    itemIds: string[];
}
