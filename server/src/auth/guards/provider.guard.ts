import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProviderService } from '../provider/provider.service';
import { Request } from 'express';

@Injectable()
export class AuthProviderGuard implements CanActivate {
  constructor(private readonly providerService: ProviderService) {}

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest() as Request;
    const provider = request.params.provider;
    const providerInstance = this.providerService.findByService(provider);

    if (!providerInstance) {
      throw new NotFoundException(
        `Provider "${provider}" not found. Please ensure that the entered data is correct and try again.`,
      );
    }

    return true;
  }
}
