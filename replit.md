# Noor Womenswear

Noor is a mobile-friendly women's clothing storefront for browsing everyday Indian wear and placing cash-on-delivery orders.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/noor-womenswear run dev` — run the storefront
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string
- Optional order handoff env: `NOOR_WHATSAPP_NUMBER` and `NOOR_ORDER_EMAIL`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/noor-womenswear/src/` — customer storefront, cart, product detail, and checkout UI
- `artifacts/api-server/src/routes/` — catalog and COD order endpoints
- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema/` — products, orders, and order items

## Architecture decisions

- Product catalog is server-backed and seeded on first catalog read so the initial storefront is never empty.
- COD confirmation provides WhatsApp and Gmail compose links instead of embedding third-party credentials in the browser.
- Cart state is intentionally local to the shopper; submitted orders are stored in PostgreSQL.

## Product

- Customers can browse products by category, view fabric/color/specification details, choose a size and quantity, and keep a cart across page reloads.
- Customers can submit a COD order with delivery details and forward the order summary to the owner through WhatsApp or Gmail.

## User preferences

- The owner wants the site to be accessible publicly through GitHub and suitable for customers who shop on mobile.

## Gotchas

- Replace the default `NOOR_WHATSAPP_NUMBER` and `NOOR_ORDER_EMAIL` values before publishing so notifications reach the owner.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
