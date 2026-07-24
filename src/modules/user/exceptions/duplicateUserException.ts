export class DuplicateUserException extends Error {
  constructor(message = "E-mail já cadastrado") {
    super(message);
    this.name = "DuplicateUserException"; 
  }
}