export class ProductNotFoundException extends Error {
  constructor(message = "Produto não encontrado") {
    super(message);
    this.name = "ProductNotFoundException"; 
  }
}