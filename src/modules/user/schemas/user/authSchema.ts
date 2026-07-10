import { z } from "zod";

export const authSchema = z.object({
  auth_token: z.string().min(1),
});
