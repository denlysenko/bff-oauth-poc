import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AccessToken } from './auth/access-token.decorator';
import { AuthGuard } from './auth/auth.guard';

@Controller()
@UseGuards(AuthGuard)
export class AppController {
  constructor(private readonly _appService: AppService) {}

  @Get('userinfo')
  userInfo(@AccessToken() accessToken: string) {
    return this._appService.userInfo(accessToken);
  }
}
