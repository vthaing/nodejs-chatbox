import { Module } from '@nestjs/common';
import { ClientScriptController } from './client-script.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [ClientScriptController],
})
export class ClientScriptModule {}
