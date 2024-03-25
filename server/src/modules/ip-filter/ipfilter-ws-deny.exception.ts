import { WsException } from '@nestjs/websockets';

export class IpFilterWsDenyException extends WsException {
  constructor(error: string | object) {
    super(error);
  }
}
