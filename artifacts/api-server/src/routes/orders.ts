import { randomUUID } from "node:crypto";
import { inArray } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { CreateOrderBody, CreateOrderResponse } from "@workspace/api-zod";
import { db, orderItemsTable, ordersTable, productsTable } from "@workspace/db";

const router: IRouter = Router();
const OWNER_WHATSAPP = process.env.NOOR_WHATSAPP_NUMBER ?? "919999999999";
const OWNER_EMAIL = process.env.NOOR_ORDER_EMAIL ?? "orders@noorwomenswear.in";

function formatOrderMessage(
  orderCode: string,
  data: {
    customerName: string;
    phone: string;
    address: string;
    city: string;
    pincode: string;
    notes?: string;
  },
  items: Array<{ productName: string; size: string; quantity: number; unitPrice: number }>,
  total: number,
): string {
  const itemLines = items
    .map(
      (item) =>
        `• ${item.productName} | Size ${item.size} | Qty ${item.quantity} | ₹${item.unitPrice * item.quantity}`,
    )
    .join("\n");

  return [
    `New Noor Womenswear COD order: ${orderCode}`,
    "",
    `Customer: ${data.customerName}`,
    `Phone: ${data.phone}`,
    `Address: ${data.address}, ${data.city} - ${data.pincode}`,
    data.notes ? `Notes: ${data.notes}` : "",
    "",
    itemLines,
    "",
    `Total: ₹${total}`,
    "Payment: Cash on Delivery",
  ]
    .filter(Boolean)
    .join("\n");
}

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid order body");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;
  const productIds = [...new Set(data.items.map((item) => item.productId))];
  const products = await db
    .select()
    .from(productsTable)
    .where(inArray(productsTable.id, productIds));
  const productsById = new Map(products.map((product) => [product.id, product]));

  const items = data.items.map((item) => {
    const product = productsById.get(item.productId);
    if (!product || !product.sizes.includes(item.size)) {
      return null;
    }

    return {
      productId: product.id,
      productName: product.name,
      size: item.size,
      quantity: item.quantity,
      unitPrice: product.price,
    };
  });

  if (items.some((item) => item === null)) {
    res.status(400).json({ error: "One or more products or sizes are no longer available" });
    return;
  }

  const validItems = items as Array<{
    productId: number;
    productName: string;
    size: string;
    quantity: number;
    unitPrice: number;
  }>;
  const total = validItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const orderCode = `NW-${randomUUID().slice(0, 8).toUpperCase()}`;
  const orderMessage = formatOrderMessage(orderCode, data, validItems, total);
  const [order] = await db
    .insert(ordersTable)
    .values({
      orderCode,
      customerName: data.customerName,
      phone: data.phone,
      address: data.address,
      city: data.city,
      pincode: data.pincode,
      notes: data.notes ?? null,
      total,
      status: "new",
    })
    .returning();

  await db.insert(orderItemsTable).values(
    validItems.map((item) => ({
      orderId: order.id,
      ...item,
    })),
  );

  const encodedMessage = encodeURIComponent(orderMessage);
  const emailSubject = encodeURIComponent(`New COD Order ${orderCode}`);
  const emailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(OWNER_EMAIL)}&su=${emailSubject}&body=${encodedMessage}`;
  const whatsappUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${encodedMessage}`;

  req.log.info({ orderCode, total, itemCount: validItems.length }, "COD order created");
  res.status(201).json(
    CreateOrderResponse.parse({
      orderId: orderCode,
      status: "new",
      total,
      whatsappUrl,
      emailUrl,
    }),
  );
});

export default router;