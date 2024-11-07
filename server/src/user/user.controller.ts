import { Controller, Get, Param } from '@nestjs/common';
import { UserRole } from '@/prisma/__generated__';
import { Authorized } from '@/auth/decorators/authorized.decorator';
import { UserService } from './user.service';
import { Authorization } from '@/auth/decorators/auth.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Authorization()
  @Get('profile')
  public async findProfile(@Authorized('id') id: string) {
    return await this.userService.findById(id);
  }

  @Authorization(UserRole.ADMIN)
  @Get(':id')
  public async findById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }
}
