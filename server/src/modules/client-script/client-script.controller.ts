import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {ConfigService} from "@nestjs/config";
import process from "process";

@Controller('client-scripts')
export class ClientScriptController {
  constructor(private readonly httpService: HttpService, private configuration: ConfigService) {}
  @Get('chat-box.js')
  async getChatBoxScript(@Req() req: Request, @Res() res: Response) {
    const publicChatboxUrl = this.getPublicChatBoxScriptUrl(req);
    const { data: chatBoxScript } = await firstValueFrom(
      this.httpService.get(publicChatboxUrl).pipe(),
    );

    res.contentType('application/javascript');
    const settings = JSON.stringify(this.getChatBoxEndpointSettings());
    res.send(
      `
     var ChatBoxEndpointSettings = ${settings};
      ${chatBoxScript}
        `,
    );
    return res;
  }

  getChatBoxEndpointSettings() {
    return {
      chatBoxInitEndpoint: this.configuration.get('chatBoxInitEndpoint'),
      chatBoxConversationEndpoint: this.configuration.get(
        'chatBoxConversationEndpoint',
      ),
    };
  }

  getPublicChatBoxScriptUrl(req: Request) {
    return `${req.protocol}://${req.get('Host')}/chat-box.js`;
  }
}
