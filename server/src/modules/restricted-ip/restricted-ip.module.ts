import { Module } from '@nestjs/common';
import { RestrictedIpService } from './restricted-ip.service';
import { RestrictedIpController } from './restricted-ip.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RestrictedIp,
  RestrictedIpSchema,
} from './entities/restricted-ip.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RestrictedIp.name,
        schema: RestrictedIpSchema,
      },
    ]),
  ],
  controllers: [RestrictedIpController],
  providers: [RestrictedIpService],
  exports: [RestrictedIpService],
})
export class RestrictedIpModule {}
