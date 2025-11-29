export * from './wishlist-acions.dto'

export class CreateWishlistDto {
  userId: string;
  restaurantId: string;
  name?: string;
  isDefault?: boolean;
}
