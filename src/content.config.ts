import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const primer = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./data" }),
  schema: z.object({
    title: z.string(),
    category: z.string(),
    categoryTitle: z.string(),
    deck: z.string(),
    order: z.number(),
    source: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { primer };
