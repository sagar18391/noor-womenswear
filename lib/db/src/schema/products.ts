import { boolean, integer, pgTable, real, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: real("price").notNull(),
  originalPrice: real("original_price").notNull(),
  description: text("description").notNull(),
  details: text("details").array().notNull(),
  sizes: text("sizes").array().notNull(),
  color: text("color").notNull(),
  fabric: text("fabric").notNull(),
  imageUrl: text("image_url").notNull(),
  featured: boolean("featured").notNull().default(false),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;