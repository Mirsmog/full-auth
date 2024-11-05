import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

dotenv.config();

export const isDev = (configService: ConfigService) =>
  configService.getOrThrow<string>('NODE_ENV') === 'dev';

export const IS_DEV_ENV = process.env.NODE_ENV === 'dev';
