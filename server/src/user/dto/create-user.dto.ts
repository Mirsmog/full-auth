import { AuthMethod } from '@/prisma/__generated__';

export class CreateUserDto {
  email: string;
  displayName: string;
  password: string;
  picture: string;
  method: AuthMethod;
  isVerified: boolean;
}
