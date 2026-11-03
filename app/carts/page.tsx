'use client';

import { useCart } from '../context/CartContext';
import { Spinner } from '@/components/tailgrids/core/spinner';
import Link from 'next/link';

export default function CartsPage() {
    const { cart, loading, removeFromCart, totalCount, totalPrice } = useCart();

    if (loading) {
        return (
            <div className="py-24 text-center">
                <Spinner className="mx-auto" />
                <span className="block mt-3 text-sm text-gray-500">Loading cart...</span>
            </div>
        );
    }

    return (
        <div className="w-[1080px] max-w-full mx-auto px-4 mb-8">
            {cart.length === 0 ? (
                <div className="py-20 text-center">
                    <p className="text-gray-400 text-base mb-4">Your cart is empty.</p>
                    <Link
                        href="/products"
                        className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition"
                    >
                        Browse Products
                    </Link>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                        {cart.map((product) => (
                            <div
                                key={product.id}
                                className="border border-gray-300 rounded-xl overflow-hidden bg-white shadow-xs flex flex-col justify-between hover:shadow-md transition duration-200"
                            >
                                <div className="relative w-full aspect-square bg-gray-100 overflow-hidden">
                                    <img
                                        src={product.url}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = product.thumbnailUrl;
                                        }}
                                    />
                                    {/* Price badge */}
                                    <span className="absolute top-1.5 right-1.5 bg-black/65 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow-sm">
                                        ${product.price.toFixed(2)}
                                    </span>
                                    {/* Title overlay */}
                                    <div className="absolute bottom-0 inset-x-0 bg-black/65 backdrop-blur-xs text-white text-[11px] p-2 line-clamp-2 leading-tight">
                                        {product.title}
                                    </div>
                                </div>

                                {/* Remove button */}
                                <div className="p-2">
                                    <button
                                        type="button"
                                        onClick={() => removeFromCart(product.id)}
                                        className="w-full py-1.5 px-3 border border-red-300 text-red-500 hover:bg-red-50 active:scale-95 text-xs font-semibold rounded-lg transition duration-150 text-center"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary badges below grid */}
                    <div className="flex items-center justify-center gap-3 mt-8 mb-6">
                        <span className="bg-[#f59e0b] text-white font-bold text-sm px-6 py-2 rounded-full shadow-sm">
                            Count: {totalCount} items
                        </span>
                        <span className="bg-[#ef4444] text-white font-bold text-sm px-6 py-2 rounded-full shadow-sm">
                            Price: ${totalPrice.toFixed(2)}
                        </span>
                    </div>
                </>
            )}
        </div>
    );
}

