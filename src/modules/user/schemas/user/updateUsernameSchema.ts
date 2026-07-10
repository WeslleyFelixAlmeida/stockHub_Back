import { z } from "zod";

export const updateUsernameSchema = z.object({
  newUsername: z.string().min(5),
});
