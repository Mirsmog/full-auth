import { AuthMethod, UserRole } from '@/prisma/__generated__';

export class User {
  id: string;
  picture: string | null;
  displayName: string;
  email: string;
  password: string;
  role: UserRole;
  method: AuthMethod;
  isVerified: boolean;
  isTwoFactorEnabled: boolean;
}
