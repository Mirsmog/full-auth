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

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
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

    return this.saveSesson(req, newUser);
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

    return this.saveSesson(req, existingUser);
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

  private async saveSesson(req: Request, user: User) {
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
