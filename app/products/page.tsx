'use client';

import { useCart } from '../context/CartContext';
import { Spinner } from '@/components/tailgrids/core/spinner';

export default function ProductsPage() {
    const { products, loading, addToCart } = useCart();

    if (loading) {
        return (
            <div className="py-24 text-center">
                <Spinner className="mx-auto" />
                <span className="block mt-3 text-sm text-gray-500">Loading products...</span>
            </div>
        );
    }

    return (
        <div className="w-[1080px] max-w-full mx-auto px-4 mb-12">
            {products.length === 0 ? (
                <div className="py-20 text-center text-gray-400 text-sm">
                    All products have been added to your cart!
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
                    {products.map((product) => (
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

                            {/* Add to Carts button */}
                            <div className="p-2">
                                <button
                                    type="button"
                                    onClick={() => addToCart(product)}
                                    className="w-full py-1.5 px-3 border border-emerald-500 text-emerald-600 hover:bg-emerald-50 active:scale-95 text-xs font-semibold rounded-lg transition duration-150 text-center"
                                >
                                    Add to Carts
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

