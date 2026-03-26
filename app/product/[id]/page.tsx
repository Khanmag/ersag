"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  stock: number;
}

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    loadProduct();
  }, [params.id]);

  async function loadProduct() {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error("Ошибка загрузки товара:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        product_id: product.id,
        name: product.name,
        price: Number(product.price),
        quantity: quantity,
        image_url: product.image_url || undefined,
      });
      alert(`Добавлено в корзину: ${product.name} x${quantity}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Товар не найден</h2>
          <Link href="/" className="text-blue-600 hover:underline">
            ← Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← Назад в каталог
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Изображение */}
            <div className="bg-gray-100">
              <img
                src={
                  product.image_url ||
                  "https://via.placeholder.com/600x600?text=No+Image"
                }
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Информация */}
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="text-3xl font-bold text-blue-600 mb-6">
                {Number(product.price).toLocaleString("ru-RU")} ₽
              </div>

              <div className="prose prose-blue mb-8">
                <h3 className="text-lg font-semibold mb-2">Описание:</h3>
                <p className="text-gray-700">
                  {product.description || "Описание товара отсутствует."}
                </p>
              </div>

              <div className="mb-6">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    product.stock > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock > 0
                    ? `В наличии: ${product.stock} шт.`
                    : "Нет в наличии"}
                </span>
              </div>

              {product.stock > 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Количество:
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="text-xl font-semibold w-12 text-center">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(Math.min(product.stock, quantity + 1))
                        }
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-green-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-600 transition"
                  >
                    Добавить в корзину
                  </button>
                </div>
              )}

              <div className="mt-8 pt-8 border-t border-gray-200 text-sm text-gray-600">
                <p>⚠️ БАД не является лекарственным средством</p>
                <p>Перед применением проконсультируйтесь со специалистом</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
