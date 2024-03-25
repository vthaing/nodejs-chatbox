import { INestApplicationContext, Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import * as redisIoAdapter from 'socket.io-redis';
import { WsAuthStrategy } from 'src/modules/auth/strategies/ws-auth.strategy';
import { ConfigService } from '@nestjs/config';
import { extract, parse } from 'query-string';
import { UserDocument } from '../modules/user/entities/user.entity';
import * as jwt from 'jsonwebtoken';

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
        await this.wsStrategy.validate(this.getUserFromWSToken(request));
        logger.verbose(`Authenticated client`);
        return allowFunction(null, true);
      } catch (e) {
        logger.error('WS Unauthorized');
        return allowFunction('Unauthorized', false);
      }
    };
    const server = super.createIOServer(port, options);
    const redisConfiguration: any = {
      host: this.configService.get('redisHost'),
      port: this.configService.get('redisPort'),
    };

    if (this.configService.get('redisPassword')) {
      redisConfiguration.password = this.configService.get('redisPassword');
    }

    console.log(redisConfiguration);

    const adapter = redisAdapter(redisConfiguration);
    server.adapter(adapter);
    return server;
  }

  getUserFromWSToken(request) {
    const token = parse(extract(request.url))?.authorization as string;
    const authToken = token.replace('Bearer', '').trim();
    const user: Partial<UserDocument> = jwt.verify(
      authToken,
      this.configService.get('jwtSecret'),
    ) as Partial<UserDocument>;
    return user;
  }
}
