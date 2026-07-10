import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string().min(6),
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "As senhas não coincidem",

      path: ["confirmPassword"],
    },
  );
