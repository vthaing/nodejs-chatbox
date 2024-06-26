import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as requestIp from '@supercharge/request-ip';
import { IpFilterService } from './ipfilter.service';
import { IPFILTER_TOKEN } from './ipfilter.constants';
import { IpFilterDenyException } from './ipfilter-deny.exception';
import { IpFilterWsDenyException } from './ipfilter-ws-deny.exception';

@Injectable()
export class IpFilterGuard implements CanActivate {
  constructor(
    @Inject(IPFILTER_TOKEN)
    private readonly ipFilterService: IpFilterService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): Promise<boolean> | Observable<boolean> | boolean {
    const ipAddress = this.getClientIpAddress(context);
    const whitelist = this.ipFilterService.whitelist;
    const blacklist = this.ipFilterService.blacklist;

    let approved = false;

    if (whitelist.length > 0) {
      approved = whitelist.some((item) => {
        return new RegExp(item).test(ipAddress);
      });
    }

    if (blacklist.length > 0) {
      approved = !blacklist.some((item) => {
        return new RegExp(item).test(ipAddress);
      });
    }

    if (!approved && this.ipFilterService.useDenyException) {
      if (context.getType() === 'ws') {
        throw new IpFilterWsDenyException('Client IP has been block');
      } else {
        throw new IpFilterDenyException(
          {
            clientIp: ipAddress,
            whitelist: whitelist,
            blacklist: blacklist,
          },
          403,
        );
      }
    }

    return approved;
  }

  getClientIpAddress(context: ExecutionContext): string {
    if (context.getType() === 'ws') {
      return context.switchToWs().getClient().handshake.address;
    }

    const request = context.switchToHttp().getRequest();
    return requestIp.getClientIp(request);
  }
}
