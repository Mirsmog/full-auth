import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { Authorized } from '@/auth/decorators/authorized.decorator';
import { Authorization } from '@/auth/decorators/auth.decorator';
import { UserRole } from '@/prisma/__generated__';

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
