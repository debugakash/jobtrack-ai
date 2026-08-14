export const PASSWORD_RESET_TOKEN_EXPIRY_MINUTES = 15;

export function getPasswordResetTokenExpiry() {
  return new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);
}
