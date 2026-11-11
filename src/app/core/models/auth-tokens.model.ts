export interface TokenInfo {
  token: string;
  expires: string;
}

export interface AuthTokens {
  access: TokenInfo;
  refresh: TokenInfo;
}
