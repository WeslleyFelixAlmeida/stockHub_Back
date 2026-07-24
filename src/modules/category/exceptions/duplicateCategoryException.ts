export class DuplicateCategoryException extends Error {
  constructor(message = "Categoria já cadastrada") {
    super(message);
    this.name = "DuplicateCategoryException"; 
  }
}