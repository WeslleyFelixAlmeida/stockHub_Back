export class CategoryNotFoundException extends Error {
  constructor(message = "Categoria não encontrada") {
    super(message);
    this.name = "CategoryNotFoundException"; 
  }
}