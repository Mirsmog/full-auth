import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha';
import { ConfigService } from '@nestjs/config';
import { isDev } from '@/libs/common/utils';

export const getRecaptchaConfig = async (
  configService: ConfigService,
): Promise<GoogleRecaptchaModuleOptions> => ({
  secretKey: configService.getOrThrow('GOOGLE_RECAPTCHA_SERVER_KEY'),
  response: (req) => req.headers.recaptcha,
  skipIf: isDev(configService),
});
