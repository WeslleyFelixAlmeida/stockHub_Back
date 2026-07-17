export interface InsertProductDTO {
  sku: string;
  name: string;
  description: string;
  barcode: string;
  image: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  minimumStock: number;
  unit: string;
  supplierName: string;
  categoryId: number;
  createdById?: number;
}
