import { INestApplicationContext, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import * as redisIoAdapter from 'socket.io-redis';
import { getUserFromWSToken } from 'src/modules/auth/utils/validate-user-ws';
import { WsAuthStrategy } from 'src/modules/auth/strategies/ws-auth.strategy';
import { ConfigService } from '@nestjs/config';

const redisAdapter: any = redisIoAdapter;

export class RedisIoAdapter extends IoAdapter {
  private wsStrategy: WsAuthStrategy;
  private configService: ConfigService;

  constructor(private app: INestApplicationContext) {
    super(app);
    this.wsStrategy = app.get(WsAuthStrategy);
    this.configService = app.get<ConfigService>(ConfigService);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    options.allowRequest = async (request, allowFunction) => {
      const logger = new Logger();
      try {
        await this.wsStrategy.validate(getUserFromWSToken(request));
        logger.verbose(`Authenticated client`);
        return allowFunction(null, true);
      } catch (e) {
        logger.error('WS Unauthorized');
        return allowFunction('Unauthorized', false);
      }
    };
    const server = super.createIOServer(port, options);
    const adapter = redisAdapter({
      host: this.configService.get('redisHost'),
      port: this.configService.get('redisPort'),
    });
    server.adapter(adapter);
    return server;
  }
}
