import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { IS_DEV_ENV } from './libs/common/utils';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProviderModule } from './auth/provider/provider.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: !IS_DEV_ENV,
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    ProviderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
