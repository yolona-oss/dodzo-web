'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import * as API from '@/api';
import { useUser } from '@/redux/actions/user';
import { useAppDispatch } from '@/redux/store';
import { newNotify } from '@/redux/features/notify/notifySlice';
import { ICartItem, IOrg } from '@dodzo-web/shared';

interface CartContextType {
    items: ICartItem[];
    loading: boolean;
    addItem: (productId: string, qty: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, qty: number) => Promise<void>;
    clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'cart_items';

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<ICartItem[]>([]);
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const dispatch = useAppDispatch();

    // Load initial cart data
    useEffect(() => {
        const loadCart = async () => {
            setLoading(true);
            try {
                if (user) {
                    const localCart = localStorage.getItem(CART_STORAGE_KEY);
                    const localItems = localCart ? JSON.parse(localCart) : [];

                    const cart = await API.getCart()

                    if (localItems.length > 0) {
                        dispatch(newNotify({
                            title: 'Syncing your cart...',
                            description: "We're adding your saved items to your account.",
                        }))
                        await mergeCarts(localItems, cart.items);
                        dispatch(newNotify({
                            title: 'Cart synced!',
                            description: 'Your items have been saved to your account.',
                        }))
                        localStorage.removeItem(CART_STORAGE_KEY);
                    } else {
                        setItems(cart.items);
                    }
                } else {
                    const storedCart = localStorage.getItem(CART_STORAGE_KEY);
                    if (storedCart) {
                        setItems(JSON.parse(storedCart));
                    }
                }
            } catch (error) {
                console.error('Error loading cart:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, [user]);

    // Sync cart to localStorage for guests
    useEffect(() => {
        if (!user) {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, user]);

    const addItem = async (productId: string, organizationId: string, quantity: number) => {
        setLoading(true);
        try {
            if (user) {
                const cart = await API.addCartItem({
                    productId,
                    organizationId,
                    quantity
                });
                setItems(cart.items);

                dispatch(newNotify({
                    title: 'Item added to cart',
                    description: 'Your item has been added to your cart successfully.',
                }))
            } else {
                // Add to local cart for guests
                const product = await API.getProductById(productId);

                const existingItem = items.find(item => item.product.id === productId);
                if (existingItem) {
                    setItems(
                        items.map(item =>
                            item.product.id === productId ? { ...item, quantity } : item,
                        ),
                    );
                } else {
                    const newItem: ICartItem = {
                        id: "sdf",
                        product,
                        organization: {} as IOrg,
                        quantity
                    };
                    setItems([...items, newItem]);
                }
                dispatch(newNotify({
                    title: 'Item added to cart',
                    description: 'Your item has been saved to your local cart.',
                }))
            }
        } catch (error) {
            dispatch(newNotify({
                title: 'Error adding item',
                description: 'There was a problem adding your item to the cart.',
                variant: 'error',
            }))
            console.error('Error adding item to cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeItem = async (productId: string) => {
        setLoading(true);
        try {
            if (user) {
                const cart = await API.removeCartItem({productId});
                setItems(cart.items);
            } else {
                setItems(items.filter(item => item.product.id !== productId));
            }
            dispatch(newNotify({
                title: 'Item removed',
                description: 'The item has been removed from your cart.',
            }))
        } catch (error) {
            dispatch(newNotify({
                title: 'Error removing item',
                description: 'There was a problem removing the item from your cart.',
                variant: 'error',
            }))
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        setLoading(true);
        try {
            if (user) {
                const items = await API.updateCartItemQuantity({productId, quantity});
                setItems(items.items);
            } else {
                setItems(
                    items.map(item =>
                        item.product.id === productId ? { ...item, quantity } : item,
                    ),
                );
            }
        } catch (error) {
            console.error('Error updating cart item:', error);
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        setLoading(true);
        try {
            if (user) {
                await API.clearCart();
            }
            setItems([]);
            dispatch(newNotify({
                title: 'Cart cleared',
                description: 'All items have been removed from your cart.',
            }))
        } catch (error) {
            dispatch(newNotify({
                title: 'Error clearing cart',
                description: 'There was a problem clearing your cart.',
                variant: 'error',
            }))
        } finally {
            setLoading(false);
        }
    };

    const mergeCarts = async (
        localItems: ICartItem[],
        serverItems: ICartItem[],
    ) => {
        // Create a map of server items for quick lookup
        const serverItemsMap = new Map(
            serverItems.map(item => [item.product.id, item]),
        );

        // Merge local items with server items
        for (const localItem of localItems) {
            const serverItem = serverItemsMap.get(localItem.product.id);
            if (serverItem) {
                // If item exists in both carts, take the higher quantity
                await updateQuantity(
                    localItem.product.id,
                    Math.max(localItem.quantity, serverItem.quantity),
                );
            } else {
                // If item only exists locally, add it to server cart
                await addItem(localItem.product.id, localItem.quantity);
            }
        }
    };

    return (
        <CartContext.Provider
            value={{
                items,
                loading,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
