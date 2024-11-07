import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '@/user/user.service';
import { AuthMethod } from '@/prisma/__generated__';
import { Request, Response } from 'express';
import { User } from './entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { verify } from 'argon2';
import { ConfigService } from '@nestjs/config';
import { ProviderService } from './provider/provider.service';
import { PrismaService } from '@/prisma/prisma.service';
import { EmailVerificationService } from './email-verification/email-verification.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly prismaService: PrismaService,
    private readonly provideService: ProviderService,
    private readonly configService: ConfigService,
    private readonly emailVerification: EmailVerificationService,
  ) {}

  public async register(req: Request, dto: RegisterDto) {
    const existingUser = await this.userService.findByEmail(dto.email);

    if (existingUser) {
      throw new ConflictException(
        'Email already in use. Please use a different one.',
      );
    }
    const newUser = await this.userService.create({
      email: dto.email,
      password: dto.password,
      displayName: dto.name,
      method: AuthMethod.CREDENTIALS,
      picture: '',
      isVerified: false,
    });

    await this.emailVerification.sendVerificationToken(newUser.email);

    return {
      message:
        'You have successfully registered. Please confirm your email. A message has been sent to your email address.',
    };
  }

  public async login(req: Request, dto: LoginDto) {
    const existingUser = await this.userService.findByEmail(dto.email);

    if (!existingUser || !existingUser.password) {
      throw new NotFoundException(
        'User not found. Please check your credentials.',
      );
    }

    const isPasswordMach = await verify(existingUser.password, dto.password);

    if (!isPasswordMach) {
      throw new UnauthorizedException(
        'Invalid password. Please verify that you have entered the correct password or use the password reset option if you have forgotten it.',
      );
    }

    await this.emailVerification.sendVerificationToken(existingUser.email);

    if (!existingUser.isVerified) {
      throw new UnauthorizedException(
        'Your email is not confirmed. Please check your email and confirm your address.',
      );
    }

    return this.saveSession(req, existingUser);
  }

  public async extractProfileFromCode(
    req: Request,
    provider: string,
    code: string,
  ) {
    const providerInstance = this.provideService.findByService(provider);
    const profile = await providerInstance.findUserByCode(code);

    const account = await this.prismaService.account.findFirst({
      where: {
        id: profile.id,
        provider: profile.provider,
      },
    });

    let user = account?.userId
      ? await this.userService.findById(account.userId)
      : null;

    if (user) {
      return this.saveSession(req, user);
    }

    user = await this.userService.create({
      displayName: profile.name,
      email: profile.email,
      password: '',
      picture: profile.picture,
      isVerified: true,
      method: AuthMethod[profile.provider.toUpperCase()],
    });

    if (!account) {
      await this.prismaService.account.create({
        data: {
          userId: user.id,
          type: 'oauth',
          provider: profile.provider,
          accessToken: profile.access_token,
          refreshToken: profile.refresh_token,
          expiresAt: profile.expires_at,
        },
      });
    }

    return this.saveSession(req, user);
  }

  public async logout(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException(
              'Failed to terminate the session. This may be due to the session already being ended or an internal error. Please check your session status and try again.',
            ),
          );
        }
        res.clearCookie(this.configService.getOrThrow('SESSION_NAME'));
        resolve();
      });
    });
  }

  public async saveSession(req: Request, user: User) {
    return new Promise((resolve, reject) => {
      req.session.userId = user.id;
      req.session.save((err) => {
        if (err) {
          return reject(
            new InternalServerErrorException('Failed to save user session'),
          );
        }
        resolve({ user });
      });
    });
  }
}
