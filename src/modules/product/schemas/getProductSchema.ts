import { z } from "zod";

export const getProductSchema = z.object({
  sku: z.string(),
});
