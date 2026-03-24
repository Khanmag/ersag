"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export async function createOrder(formData: FormData) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  // Получаем текущего пользователя
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Необходимо войти в систему" };

  // Парсим данные корзины
  const items = JSON.parse(formData.get("items") as string);
  const total = parseFloat(formData.get("total") as string);

  // Создаем заказ
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      total_amount: total,
      status: "pending",
    })
    .select()
    .single();

  if (orderError) return { error: orderError.message };

  // Создаем позиции заказа
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.price,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);
  if (itemsError) return { error: itemsError.message };

  revalidatePath("/orders");
  return { success: true, orderId: order.id };
}
