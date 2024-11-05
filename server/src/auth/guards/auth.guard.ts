import { UserService } from '@/user/user.service';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.session.userId;

    if (!userId) {
      throw new UnauthorizedException(
        'Session not found. Please log in to access this resource.',
      );
    }

    const existingUser = await this.userService.findById(userId);

    request.user = existingUser;

    return true;
  }
}
