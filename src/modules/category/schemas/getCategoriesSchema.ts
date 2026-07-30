import { z } from "zod";
export const getCategorySchema = z.object({
  id: z.coerce.number().min(0),
});
