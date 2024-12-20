import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { ResponseInterceptor } from './config/interceptors';
import { DBExceptionFilter, HttpExceptionFilter } from './config/exceptions';
import { initSwagger } from './docs/swagger';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      enableDebugMessages: true,
      skipMissingProperties: false,
      forbidUnknownValues: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(
    new ResponseInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
    new LoggerErrorInterceptor()
  );
  app.useGlobalFilters(new HttpExceptionFilter(), new DBExceptionFilter());
  initSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
