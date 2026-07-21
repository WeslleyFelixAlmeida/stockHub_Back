declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
    interface Request {
      productPagination?: {
        nextSKU?: string;
        hasNext: boolean;
      };
    }
    interface Request {
      getProductData: {
        sku: string;
      };
    }
  }
}

export {};
