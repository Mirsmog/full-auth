import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthProviderGuard } from '../guards/provider.guard';

export const OAuth = () => applyDecorators(UseGuards(AuthProviderGuard));
