# Noor Womenswear

Noor is a mobile-first women’s clothing storefront for kurtis, long and short kurtis, night suits, cord sets, and everyday wear.

## What customers can do

- Browse a real product catalog and filter by category
- Open a product to see fabric, color, sizes, care details, price, and delivery information
- Add products and quantities to a persistent shopping bag
- Place a cash-on-delivery order with name, phone, address, city, pincode, and notes
- Forward the order summary to the owner through WhatsApp or Gmail after checkout

## Run locally

```bash
pnpm install
pnpm --filter @workspace/db run push
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/noor-womenswear run dev
```

The Replit workflows start the API and storefront together. The database is PostgreSQL and is configured through `DATABASE_URL`.

## Before publishing

Set these optional environment variables to the owner’s real contacts:

- `NOOR_WHATSAPP_NUMBER` — WhatsApp number with country code and no `+` or spaces, for example `919876543210`
- `NOOR_ORDER_EMAIL` — Gmail or business email that should receive order handoffs

The current demo values are intentionally placeholders.

## API

- `GET /api/products`
- `GET /api/products/:slug`
- `POST /api/orders`

Orders are stored in PostgreSQL. The notification links open a pre-filled WhatsApp message or Gmail compose window so the customer can send the order details to the owner.