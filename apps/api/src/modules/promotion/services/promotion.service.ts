import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/core';
import { Promotion } from 'entities/promotion.entity';
import { Cart } from 'entities/cart/cart.entity';
import { CartPromotion } from 'entities/cart/cart-promotion.entity';
import { v4 as uuid } from 'uuid';
import { Product } from 'entities/product/product.entity';
import { CartItem } from 'entities/cart/cart-item.entity';

@Injectable()
export class PromotionService {
    constructor(private readonly em: EntityManager) {}

    async createPromotion(payload: { name: string; code?: string; rule: any; restaurantId?: string }) {
        const p = this.em.create(Promotion, {
            id: uuid(),
            name: payload.name,
            code: payload.code,
            rule: payload.rule,
            restaurant: payload.restaurantId ? ({ id: payload.restaurantId } as any) : undefined,
            isActive: true,
        } as any);
        await this.em.persistAndFlush(p);
        return p;
    }

    async listActivePromotions() {
        return this.em.find(Promotion, { isActive: true });
    }

    async applyPromotionsToCart(cart: Cart) {
        await this.em.populate(cart, ['items']);
        const subtotal = cart.items.reduce((s, it: CartItem) => s + (it.unitPrice || 0) * it.qty, 0);

        cart.appliedPromotions.removeAll()

        const promotions = await this.em.find(Promotion, { isActive: true });
        let discount = 0;
        for (const promo of promotions) {
            if (promo.rule?.type === 'percentage' && subtotal > (promo.rule.minSubtotal || 0)) {
                const amount = Math.floor((subtotal * (promo.rule.amount || 0)) / 100);
                discount += amount;
                const cp = this.em.create(CartPromotion, {
                    id: uuid(),
                    cart,
                    promotion: promo,
                    result: { type: 'percentage', amount },
                } as any);
                cart.appliedPromotions.add(cp);
                this.em.persist(cp);
            }

            if (promo.rule?.type === 'add_product_if' && promo.rule?.condition === 'subtotal_gt' && subtotal > (promo.rule.value || 0)) {
                const sku = promo.rule.sku;
                const product = await this.em.findOne(Product, { name: sku })
                if (product) {
                    const existing = cart.items.find(i => i.product.id === product.id && i.isPromotion);
                    if (!existing) {
                        const promoItem = this.em.create(CartItem, {
                            id: uuid(),
                            cart,
                            product,
                            qty: 1,
                            unitPrice: 0,
                            totalPrice: 0,
                            isPromotion: true,
                        } as any);
                        cart.items.add(promoItem);
                        this.em.persist(promoItem);
                        const cp = this.em.create(CartPromotion, {
                            id: uuid(),
                            cart,
                            promotion: promo,
                            result: { addedProductId: product.id },
                        } as any);
                        cart.appliedPromotions.add(cp);
                        this.em.persist(cp);
                    }
                }
            }
        }

        cart.totalsSnapshot = { subtotal, discount, total: subtotal - discount };
        await this.em.flush();
    }
}
