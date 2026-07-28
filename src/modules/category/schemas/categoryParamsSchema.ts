import { z } from "zod";
export const categoryParamsSchema = z.object({
  id: z.coerce.number(),
});
