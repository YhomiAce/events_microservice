import { Module } from '@nestjs/common';
import { NotificationsModule } from './modules/notification/notifications.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { LoggerModule } from './common/logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '',
      validationSchema: Joi.object({
        PORT: Joi.string().required(),
        SMTP_USER: Joi.string().required(),
        SMTP_HOST: Joi.string().required(),
        MAIL_FROM: Joi.string().required(),
        SMTP_PASSWORD: Joi.string().required(),
        SMTP_PORT: Joi.number().required(),
      }),
    }),
    NotificationsModule,
    LoggerModule
  ],
})
export class AppModule {}
