import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'argon2';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  public async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      throw new NotFoundException(
        'User not found. Please check your credentials.',
      );
    }

    return user;
  }

  public async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
      },
    });

    return user;
  }

  public async create(dto: CreateUserDto) {
    const user = await this.prisma.user.create({
      data: {
        ...dto,
        password: dto.password ? await hash(dto.password) : '',
      },
      include: {
        accounts: true,
      },
    });
    return user;
  }

  public async update(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
    return user;
  }
}
