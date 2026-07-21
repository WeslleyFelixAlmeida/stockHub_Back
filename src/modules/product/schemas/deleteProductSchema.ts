import { z } from "zod";

export const deleteProductSchema = z.object({
  sku: z.string(),
});
