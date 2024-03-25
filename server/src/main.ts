import { NestFactory } from '@nestjs/core';

import { RedisIoAdapter } from './adapters/redis-io.adapter';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

import mongoose from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
mongoose.set('debug', true);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  app.setGlobalPrefix('api');
  app.useWebSocketAdapter(new RedisIoAdapter(app));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Chat')
    .setDescription('The chat API description')
    .setVersion('1.0')
    .addTag('chat')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapi', app, document);
  const configService = app.get<ConfigService>(ConfigService);

  await app.listen(configService.get('port'));
}
bootstrap();
