import { forwardRef, Module } from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { MailModule } from '@/libs/mail/mail.module';
import { AuthModule } from '../auth.module';
import { MailService } from '@/libs/mail/mail.service';
import { UserService } from '@/user/user.service';
import { EmailVerificationController } from './email-verification.controller';

@Module({
  imports: [MailModule, forwardRef(() => AuthModule)],
  providers: [EmailVerificationService, UserService, MailService],
  controllers: [EmailVerificationController],
  exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
