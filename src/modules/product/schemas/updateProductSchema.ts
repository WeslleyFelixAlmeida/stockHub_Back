import { z } from "zod";
import { insertNewProductSchema } from "./insertNewProductSchema";

export const updateProductSchema = insertNewProductSchema
  .omit({ sku: true })
  .partial();

export type UpdateProductSchemaType = z.infer<typeof updateProductSchema>;

export const updateProductParamsSchema = z.object({
  sku: z.string().min(5),
});