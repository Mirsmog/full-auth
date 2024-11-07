import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import { EmailVerificationService } from './email-verification.service';
import { Request } from 'express';
import { VerificatonDto } from './dto/verification.dto';

@Controller('auth/email-verification')
export class EmailVerificationController {
  constructor(
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  public async newVerification(
    @Req() req: Request,
    @Body() dto: VerificatonDto,
  ) {
    return await this.emailVerificationService.newVerification(req, dto);
  }
}
