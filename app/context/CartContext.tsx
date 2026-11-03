'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { PhotoType as Product, photos, fetchPhotos } from '../data/photos';

interface CartContextType {
    products: Product[];
    cart: Product[];
    loading: boolean;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    totalCount: number;
    totalPrice: number;
    resetProducts: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'csi205_products_list';
const CART_STORAGE_KEY = 'csi205_cart_list';

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>(photos);
    const [cart, setCart] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    useEffect(() => {
        try {
            const storedProducts = localStorage.getItem(PRODUCTS_STORAGE_KEY);
            const storedCart = localStorage.getItem(CART_STORAGE_KEY);

            if (storedProducts !== null) {
                const parsedProducts = JSON.parse(storedProducts) as Product[];
                const parsedCart = storedCart ? (JSON.parse(storedCart) as Product[]) : [];
                if (parsedProducts.length > 0 || parsedCart.length > 0) {
                    setProducts(parsedProducts);
                    setCart(parsedCart);
                    setIsInitialized(true);
                    return;
                }
            }

            // Fallback to initial mock photos
            setProducts(photos);
            setCart([]);
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(photos));
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
        } catch (error) {
            console.error("Failed to load products from localStorage:", error);
            setProducts(photos);
        } finally {
            setIsInitialized(true);
        }
    }, []);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
        }
    }, [products, cart, isInitialized]);

    const addToCart = (product: Product) => {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        setCart((prev) => [...prev, product]);
    };

    const removeFromCart = (productId: number) => {
        const itemToRemove = cart.find((item) => item.id === productId);
        if (itemToRemove) {
            setCart((prev) => prev.filter((item) => item.id !== productId));
            setProducts((prev) =>
                [...prev, itemToRemove].sort((a, b) => a.id - b.id)
            );
        }
    };

    const resetProducts = async () => {
        setLoading(true);
        try {
            const fetched = await fetchPhotos();
            setProducts(fetched);
            setCart([]);
            localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(fetched));
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]));
        } finally {
            setLoading(false);
        }
    };

    const totalCount = cart.length;
    const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

    return (
        <CartContext.Provider
            value={{
                products,
                cart,
                loading,
                addToCart,
                removeFromCart,
                totalCount,
                totalPrice,
                resetProducts,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
