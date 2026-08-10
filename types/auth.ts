export interface SessionPayload {
  username: string;
  displayName: string;
  iat: number;
  exp: number;
}

export interface LoginInput {
  username: string;
  password: string;
  rememberMe?: boolean;
}
