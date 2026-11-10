import { Role } from '../../../generated/prisma/client';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: AuthUser;
  tokens: TokenPair;
}
