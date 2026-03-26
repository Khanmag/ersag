/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
}

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const handleAddToCart = () => {
    addToCart({
      product_id: product.id,
      name: product.name,
      price: Number(product.price),
      quantity: 1,
      image_url: product.image_url || undefined,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      {/* Изображение товара */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <Link href={`/product/${product.id}`}>
          <img
            src={
              product.image_url ||
              "https://via.placeholder.com/400x300?text=No+Image"
            }
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Нет в наличии
          </div>
        )}
      </div>

      {/* Информация о товаре */}
      <div className="p-5">
        <Link href={`/product/${product.id}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">
          {product.description || "Описание товара..."}
        </p>

        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">
            {Number(product.price).toLocaleString("ru-RU")} ₽
          </div>

          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              product.stock === 0
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
          >
            {product.stock === 0 ? "Нет в наличии" : "В корзину"}
          </button>
        </div>
      </div>
    </div>
  );
}
