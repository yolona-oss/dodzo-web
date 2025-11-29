// import { Injectable, Logger } from '@nestjs/common';
// import { EntityManager } from '@mikro-orm/core';
// import { StoplistCandidate } from 'entities/stoplist-candidate.entity';
// import { NotificationService } from 'modules/notification/services/common-notification.service'
// import { Product } from 'entities/product.entity';
// import { ProductIngredient } from 'entities/product-ingredient.entity';
// import { Order } from 'entities/order.entity';
// import { OrderStatus } from '@dodzo-web/shared';
//
// @Injectable()
// export class StoplistService {
//     constructor(
//         private readonly em: EntityManager,
//         private readonly notificationService: NotificationService
//     ) {}
//
//      /**
//     * Approve candidate. This will set product.isActive=false or mark ingredient as depleted and
//     * mark dependent products as pending stop → isActive=false after approval.
//     * Then notify affected customers of pending change.
//     */
//     async approveCandidate(candidateId: string, approverId: string) {
//         return this.em.transactional(async em => {
//             const cand = await em.findOneOrFail(StoplistCandidate, candidateId, { populate: ['ingredient', 'product'] });
//             cand.approved = true;
//             cand.approvedBy = approverId;
//             cand.approvedAt = new Date();
//             em.persist(cand);
//
//             const affectedProducts: Product[] = [];
//             if (cand.ingredient) {
//                 // mark dependent products
//                 const pis = await em.find(ProductIngredient, { ingredient: cand.ingredient }, { populate: ['product'] });
//                 for (const pi of pis) {
//                     pi.product.isActive = false;
//                     em.persist(pi.product);
//                     affectedProducts.push(pi.product);
//                 }
//             }
//             if (cand.product) {
//                 cand.product.isActive = false;
//                 em.persist(cand.product);
//                 affectedProducts.push(cand.product);
//             }
//             await em.flush();
//
//             // find orders that include affected products and are not yet delivered
//             const productIds = affectedProducts.map(p => p.id);
//             const orders = await em.find(Order, {
//                 status: { $nin: [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED, OrderStatus.CANCELLED] },
//             });
//
//             const impacted: Order[] = [];
//             for (const order of orders) {
//                 if (order.itemsSnapshot.some(it => productIds.includes(it.productId))) {
//                     impacted.push(order);
//                 }
//             }
//
//             // notify customers
//             for (const order of impacted) {
//                 await this.notificationService.notifyUser(order.user.id, {
//                     type: 'order_item_runout',
//                     orderId: order.id,
//                     deadlineMinutes: 15,
//                 });
//             }
//
//             return { ok: true, notified: impacted.length };
//         });
//     }
// }
