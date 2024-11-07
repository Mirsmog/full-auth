import { TypeOptions } from '@/auth/provider/provider.constants';
import { GithubProvider } from '@/auth/provider/services/github.provider';
import { GoogleProvider } from '@/auth/provider/services/google.provider';
import { ConfigService } from '@nestjs/config';

export const getProviderConfig = async (
  configService: ConfigService,
): Promise<TypeOptions> => ({
  baseUrl: configService.getOrThrow<string>('CLIENT_URL'),
  services: [
    new GoogleProvider({
      client_id: configService.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      client_secret: configService.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      scopes: ['email', 'profile'],
    }),
    new GithubProvider({
      client_id: configService.getOrThrow<string>('GITHUB_CLIENT_ID'),
      client_secret: configService.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
      scopes: ['read:user'],
    }),
  ],
});
