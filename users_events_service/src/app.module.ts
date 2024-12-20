import { Module } from '@nestjs/common';
import * as Joi from "joi";
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EventModule } from './modules/event/event.module';
import configuration from './config/configuration';
import AppCacheModule from './config/cache';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '',
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
      }),
      load: configuration,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get<TypeOrmModuleOptions>('db.postgres', {
          type: 'postgres',
        }),
      inject: [ConfigService],
    }),
    AppCacheModule,
    LoggerModule,
    UserModule,
    AuthModule,
    EventModule,
  ],
  providers: [],
})
export class AppModule {}
