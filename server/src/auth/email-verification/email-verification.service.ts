import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

import { User } from '../entities/user.entity';
import { TokenType } from '@/prisma/__generated__';
import { AuthService } from '../auth.service';
import { MailService } from '@/libs/mail/mail.service';
import { UserService } from '@/user/user.service';
import { PrismaService } from '@/prisma/prisma.service';
import { VerificatonDto } from './dto/verification.dto';

@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly mailService: MailService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  public async newVerification(req: Request, dto: VerificatonDto) {
    const existingToken = await this.prismaService.token.findUnique({
      where: { token: dto.token, type: TokenType.VERIFICATION },
    });

    if (!existingToken) {
      throw new NotFoundException(
        'Confirmation token not found. Please make sure you have the correct token.',
      );
    }

    const isExpired = new Date(existingToken.expiresIn) < new Date();

    if (isExpired) {
      throw new BadRequestException(
        'The confirmation token has expired. Please request a new token.',
      );
    }

    const existingUser = await this.userService.findByEmail(
      existingToken.email,
    );

    if (!existingUser) {
      throw new NotFoundException('User not found. Please check your email.');
    }

    await this.userService.update(existingUser.id, { isVerified: true });

    await this.prismaService.token.delete({ where: { id: existingToken.id } });

    return this.authService.saveSession(req, existingUser);
  }
  public async sendVerificationToken(email: string) {
    const verificationToken = await this.generateVerificationToken(email);
    await this.mailService.sendEmailVerification(
      verificationToken.email,
      verificationToken.token,
    );
    return true;
  }

  private async generateVerificationToken(email: string) {
    const token = uuidv4();
    const expiresIn = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await this.prismaService.token.findFirst({
      where: { email, type: TokenType.VERIFICATION },
    });

    if (existingToken) {
      await this.prismaService.token.delete({
        where: {
          id: existingToken.id,
        },
      });
    }

    const verificationToken = this.prismaService.token.create({
      data: {
        email,
        token,
        expiresIn,
        type: TokenType.VERIFICATION,
      },
    });

    return verificationToken;
  }
}
