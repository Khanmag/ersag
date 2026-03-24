"use client";

import { useCartStore } from "@/store/cartStore";
import { createOrder } from "@/actions/createOrder";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function CartPage() {
  const { items, total, removeFromCart, clearCart } = useCartStore();
  const router = useRouter();

  const handleCheckout = async () => {
    // Проверка авторизации
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const formData = new FormData();
    formData.append("items", JSON.stringify(items));
    formData.append("total", total().toString());

    const result = await createOrder(formData);

    if (result.success) {
      clearCart();
      alert(`Заказ ${result.orderId} создан! Переходим к оплате...`);
      // Здесь позже добавим перенаправление на оплату
      router.push("/orders");
    } else {
      alert("Ошибка: " + result.error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Корзина пуста</h1>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Перейти к покупкам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Корзина</h1>

        <div className="space-y-4 mb-8">
          {items.map((item) => (
            <div
              key={item.product_id}
              className="bg-white rounded-lg shadow p-6 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                {item.image_url && (
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600">
                    {item.quantity} шт. × {item.price.toLocaleString()} ₽
                  </p>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.product_id)}
                className="text-red-500 hover:text-red-700 font-medium"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6 sticky bottom-4">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">Итого:</span>
            <span className="text-2xl font-bold">
              {total().toLocaleString()} ₽
            </span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition"
          >
            Оформить заказ
          </button>
        </div>
      </div>
    </div>
  );
}
