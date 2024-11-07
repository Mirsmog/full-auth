import { isDev } from '@/libs/common/utils';
import { MailerOptions } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

export const getMailerConfig = async (
  configService: ConfigService,
): Promise<MailerOptions> => ({
  transport: {
    service: 'gmail',
    host: configService.getOrThrow<number>('MAIL_HOST'),
    port: configService.getOrThrow<number>('MAIL_PORT'),
    secure: !isDev(configService),
    auth: {
      user: configService.getOrThrow<string>('MAIL_LOGIN'),
      pass: configService.getOrThrow<string>('MAIL_PASSWORD'),
    },
  },
  defaults: {
    from: `"SecureCode Team" ${configService.getOrThrow<string>('MAIL_LOGIN')}`,
  },
});
