import { and, count, eq, like } from "drizzle-orm";
import { db, productsTable, type InsertProduct } from "@workspace/db";

export const sampleProducts: InsertProduct[] = [
  {
    slug: "gulmohar-printed-kurti",
    name: "Gulmohar Printed Kurti",
    category: "Kurtis",
    price: 899,
    originalPrice: 1299,
    description: "A breezy printed kurti made for bright mornings and easy plans.",
    details: ["Straight fit", "Three-quarter sleeves", "Side slits", "Machine washable"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    color: "Marigold",
    fabric: "Rayon",
    imageUrl: "/products/gulmohar-printed-kurti.jpg",
    featured: true,
  },
  {
    slug: "mauve-everyday-kurti",
    name: "Mauve Everyday Kurti",
    category: "Daily Wear",
    price: 749,
    originalPrice: 999,
    description: "Soft colour, relaxed comfort, and a shape that works from desk to dinner.",
    details: ["Comfort fit", "Button placket", "Pocket detail", "Easy-care fabric"],
    sizes: ["S", "M", "L", "XL"],
    color: "Dusty Mauve",
    fabric: "Cotton Slub",
    imageUrl: "/products/mauve-everyday-kurti.jpg",
    featured: true,
  },
  {
    slug: "indigo-loom-cord-set",
    name: "Indigo Loom Cord Set",
    category: "Cord Sets",
    price: 1199,
    originalPrice: 1699,
    description: "An effortless co-ord in a deep indigo weave for days you want to look put together.",
    details: ["Top and trouser set", "Elasticated waist", "Relaxed silhouette", "Colourfast"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    color: "Indigo",
    fabric: "Cotton Flex",
    imageUrl: "/products/indigo-loom-cord-set.jpg",
    featured: true,
  },
  {
    slug: "rosewood-night-suit",
    name: "Rosewood Night Suit",
    category: "Night Suits",
    price: 999,
    originalPrice: 1399,
    description: "Lightweight, soft, and made for slower evenings at home.",
    details: ["Two-piece set", "Relaxed fit", "Full-length bottoms", "Breathable finish"],
    sizes: ["M", "L", "XL", "XXL"],
    color: "Rosewood",
    fabric: "Cotton",
    imageUrl: "/products/rosewood-night-suit.jpg",
    featured: false,
  },
  {
    slug: "sandstone-long-kurti",
    name: "Sandstone Long Kurti",
    category: "Long Kurtis",
    price: 1099,
    originalPrice: 1499,
    description: "A longline layer with a quiet print and plenty of movement.",
    details: ["Longline cut", "Full sleeves", "Printed yoke", "Straight hem"],
    sizes: ["S", "M", "L", "XL"],
    color: "Sandstone",
    fabric: "Viscose",
    imageUrl: "/products/sandstone-long-kurti.jpg",
    featured: false,
  },
  {
    slug: "petal-pink-short-kurti",
    name: "Petal Pink Short Kurti",
    category: "Short Kurtis",
    price: 699,
    originalPrice: 899,
    description: "A playful short kurti that pairs easily with jeans, palazzos, or your favourite skirt.",
    details: ["Short length", "V-neckline", "Three-quarter sleeves", "Soft hand feel"],
    sizes: ["S", "M", "L", "XL"],
    color: "Petal Pink",
    fabric: "Cotton Rayon",
    imageUrl: "/products/petal-pink-short-kurti.jpg",
    featured: false,
  },
];

export async function ensureCatalogSeeded(): Promise<void> {
  const [{ value }] = await db.select({ value: count() }).from(productsTable);
  if (value === 0) {
    await db.insert(productsTable).values(sampleProducts);
    return;
  }

  for (const sample of sampleProducts) {
    await db
      .update(productsTable)
      .set({ imageUrl: sample.imageUrl })
      .where(
        and(
          eq(productsTable.slug, sample.slug),
          like(productsTable.imageUrl, "https://images.unsplash.com%"),
        ),
      );
  }
}