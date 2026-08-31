import { AppError } from "./AppError.js";

export class AIServiceError extends AppError {
  constructor(
    message = "AI service is temporarily unavailable. Please try again.",
    statusCode = 503,
  ) {
    super(message, statusCode);
  }
}
