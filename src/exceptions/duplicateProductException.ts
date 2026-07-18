export class DuplicateProductException extends Error {
  constructor(message = "SKU já cadastrado") {
    super(message);
    this.name = "DuplicateProductException"; 
  }
}