import { NestFactory, Reflector } from '@nestjs/core';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './infra/http/filters/global-exception.filter';
import { TransformInterceptor } from './infra/http/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({ prefix: 'PeladaDraft' }),
  });

  app.set('trust proxy', Number(process.env.TRUST_PROXY ?? 0));

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.use(cookieParser());

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

  const config = new DocumentBuilder()
    .setTitle('API de Peladas')
    .setDescription(
      'Documentação completa da API de gerenciamento de peladas, jogadores e sorteio equilibrado de times.',
    )
    .setVersion('1.0')
    .addCookieAuth('access_token')
    .addCookieAuth('refresh_token')
    .addTag('Autenticação', 'Rotas de login, cadastro e sessão')
    .addTag('Peladas', 'Gerenciamento dos grupos de pelada')
    .addTag('Jogadores', 'Gerenciamento dos jogadores dentro das peladas')
    .addTag('Sorteio', 'Gerenciamento de sorteio de times dentro da pelada')
    .addTag(
      'Permissões',
      'Gerenciamento de permissões de usuários dentro da pelada',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
