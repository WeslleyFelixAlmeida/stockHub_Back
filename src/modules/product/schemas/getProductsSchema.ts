import { z } from "zod";

export const getProductsSchema = z.object({
  nextSKU: z.string().optional(),
  hasNext: z.coerce.boolean(),
});
