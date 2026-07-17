export interface ProductModel {
  id?: number;
  sku: string;
  name: string;
  description?: string;
  barcode?: string;
  image?: Buffer;
  imageType?: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  minimumStock: number;
  unit: string;
  supplierName: string;
  categoryId: number;
  createdById: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
