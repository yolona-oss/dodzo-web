export * from './cart-actions.dto'

export class CreateCartDto {
  userId: string;
  restaurantId: string;
  sessionId?: string;
}
