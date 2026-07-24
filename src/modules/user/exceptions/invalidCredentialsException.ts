export class InvalidCredentialsException extends Error {
  constructor(message = "Credenciais inválidas") {
    super(message);
    this.name = "InvalidCredentialsException"; 
  }
}