import { forwardRef, Module } from '@nestjs/common';
import { RestrictedIpService } from './restricted-ip.service';
import { RestrictedIpController } from './restricted-ip.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  RestrictedIp,
  RestrictedIpSchema,
} from './entities/restricted-ip.entity';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RestrictedIp.name,
        schema: RestrictedIpSchema,
      },
    ]),
    forwardRef(() => CommonModule),
  ],
  controllers: [RestrictedIpController],
  providers: [RestrictedIpService],
  exports: [RestrictedIpService],
})
export class RestrictedIpModule {}
