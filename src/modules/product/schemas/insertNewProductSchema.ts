import { z } from "zod";
const MAX_IMAGE_SIZE_MB = 5;
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

function getBase64SizeInBytes(base64: string): number {
  const cleanBase64 = base64.includes(",") ? base64.split(",")[1] : base64;
  return Buffer.byteLength(cleanBase64, "base64");
}

export const insertNewProductSchema = z.object({
  sku: z.string().min(5),
  name: z.string().min(5),
  description: z.string().min(5).optional(),
  barcode: z.string().min(5),
  image: z
    .string()
    .min(5)
    .refine(
      (value) => {
        const match = value.match(/^data:(image\/\w+);base64,/);
        return match ? ALLOWED_IMAGE_TYPES.includes(match[1]) : false;
      },
      { message: "Formato de imagem não suportado. Use PNG, JPEG ou WEBP." },
    )
    .refine((value) => getBase64SizeInBytes(value) <= MAX_IMAGE_SIZE_BYTES, {
      message: `Imagem excede o tamanho máximo de ${MAX_IMAGE_SIZE_MB}MB`,
    }),
  purchasePrice: z.number().min(1),
  salePrice: z.number().min(1),
  stock: z.int().min(1),
  minimumStock: z.int().min(1),
  unit: z.string().min(1), // ainda em definição — padrões + customizados pelo usuário
  supplierName: z.string().min(5),
  categoryId: z.number().min(1),
});
