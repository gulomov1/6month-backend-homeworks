const validRefreshTokens = new Set<string>();

export function saveRefreshToken(token: string): void {
  validRefreshTokens.add(token);
}

export function isRefreshTokenValid(token: string): boolean {
  return validRefreshTokens.has(token);
}

export function removeRefreshToken(token: string): void {
  validRefreshTokens.delete(token);
}
