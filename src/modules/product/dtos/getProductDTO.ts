export interface PaginationInformations {
  nextSKU?: string;
  hasNext?: boolean;
}

export interface GetProductsDTO {
  productsData: {
    sku: string;
    name: string;
    stock: number;
  }[];
  paginationData: PaginationInformations;
}

export interface GetProductDTO {
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
}
