import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { UserService } from '@/user/user.service';
import { ProviderModule } from './provider/provider.module';
import { AuthController } from './auth.controller';
import { getProviderConfig } from '@/config/providers.config';
import { getRecaptchaConfig } from '@/config/recaptcha.config';
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { MailService } from '@/libs/mail/mail.service';

@Module({
  imports: [
    ProviderModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getProviderConfig,
      inject: [ConfigService],
    }),
    GoogleRecaptchaModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getRecaptchaConfig,
      inject: [ConfigService],
    }),
    forwardRef(() => EmailVerificationModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, MailService],
  exports: [AuthService],
})
export class AuthModule {}
