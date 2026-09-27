import { eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { GetProductParams, GetProductResponse, ListProductsResponse } from "@workspace/api-zod";
import { db, productsTable } from "@workspace/db";
import { ensureCatalogSeeded } from "../lib/catalog";

const router: IRouter = Router();

router.get("/products", async (req, res): Promise<void> => {
  await ensureCatalogSeeded();
  const products = await db.select().from(productsTable);
  req.log.info({ count: products.length }, "Catalog loaded");
  res.json(ListProductsResponse.parse(products));
});

router.get("/products/:slug", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  await ensureCatalogSeeded();
  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.slug, params.data.slug));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(GetProductResponse.parse(product));
});

export default router;