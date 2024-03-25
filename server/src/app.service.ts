import { Inject, Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { RestrictedIpService } from './modules/restricted-ip/restricted-ip.service';
import { IPFILTER_TOKEN } from './modules/ip-filter/ipfilter.constants';
import { IpFilterService } from './modules/ip-filter/ipfilter.service';

@Injectable()
export class AppService {
  constructor(
    @Inject(IPFILTER_TOKEN) private readonly ipFilterService: IpFilterService,
    private readonly restrictedIpService: RestrictedIpService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  /**
   * @TODO: I can not find out the way to inject the ipFilterService into the RestrictedIpService so I used this fucking way
   */
  @OnEvent('restricted-ip-changed')
  handleRestrictedIpChanged() {
    this.restrictedIpService.getAllRestrictedIps().then((ips) => {
      this.ipFilterService.blacklist = ips;
    });
  }
}
