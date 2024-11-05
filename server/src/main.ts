import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import IORedis from 'ioredis';
import { ValidationPipe } from '@nestjs/common';
import {
  type StringValue,
  parseBoolean,
  parseStrict as ms,
} from './libs/common/utils';
import RedisStore from 'connect-redis';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const redis = new IORedis(config.getOrThrow<string>('REDIS_URI'));

  app.use(cookieParser(config.getOrThrow<string>('COOKIES_SECRET')));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(
    session({
      secret: config.getOrThrow<string>('SESSION_SECRET'),
      name: config.getOrThrow<string>('SESSION_NAME'),
      resave: true,
      saveUninitialized: false,
      cookie: {
        domain: config.getOrThrow<string>('SESSION_DOMAIN'),
        maxAge: ms(config.getOrThrow<StringValue>('SESSION_MAX_AGE')),
        httpOnly: parseBoolean(config.getOrThrow<string>('SESSION_HTTP_ONLY')),
        secure: parseBoolean(config.getOrThrow<string>('SESSION_SECURE')),
        sameSite: 'lax',
      },
      store: new RedisStore({
        client: redis,
        prefix: config.getOrThrow('SESSION_FOLDER'),
      }),
    }),
  );

  app.enableCors({
    origin: config.getOrThrow<string>('CLIENT_URL'),
    credentials: true,
    exposedHeaders: ['set-cookie'],
  });

  await app.listen(config.getOrThrow<number>('SERVER_PORT'));
}
bootstrap();
