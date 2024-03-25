import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';
import { SimpleChatBoxController } from './simple-chat-box.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env.local', '.env'],
    }),
  ],
  controllers: [AppController, SimpleChatBoxController],
  providers: [AppService],
})
export class AppModule {}
