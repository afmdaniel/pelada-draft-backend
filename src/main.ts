import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './infra/http/filters/global-exception.filter';
import { TransformInterceptor } from './infra/http/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const reflector = app.get(Reflector);

  app.useGlobalFilters(new GlobalExceptionFilter());

  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix(process.env.API_PREFIX ?? 'api/v1');

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
