import { z } from "zod";

export const updateCategoryNameSchema = z.object({
  name: z.string().min(1),
});
