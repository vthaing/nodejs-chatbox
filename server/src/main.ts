import { NestFactory } from '@nestjs/core';

import { RedisIoAdapter } from './adapters/redis-io.adapter';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useWebSocketAdapter(new RedisIoAdapter(app));
  app.enableCors();
  await app.listen(3001);
}
bootstrap();
