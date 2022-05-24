import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Redirect,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthCookie } from './auth-cookie.decorator';
import { AuthService } from './auth.service';
import { AuthRoutes, AUTH_COOKIE } from './constants';

@Controller()
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    private readonly _configService: ConfigService
  ) {}

  @Post(AuthRoutes.Login)
  @HttpCode(HttpStatus.OK)
  login() {
    const redirectUrl = this._authService.login();

    return { redirectUrl };
  }

  @Get(AuthRoutes.SigninOidc)
  @Redirect()
  async signinOidc(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const cookie = await this._authService.callback(req);

    res.cookie(AUTH_COOKIE, cookie, {
      httpOnly: true,
      sameSite: 'strict',
      // secure: true
    });

    return { url: this._configService.get('FRONTEND_URL') };
  }

  @Post(AuthRoutes.Logout)
  @HttpCode(HttpStatus.OK)
  async logout(
    @AuthCookie() authCookie: string,
    @Res({ passthrough: true }) res: Response
  ) {
    res.cookie(AUTH_COOKIE, '', {
      httpOnly: true,
      sameSite: 'strict',
      expires: new Date('1970-01-01'),
      // secure: true
    });

    const redirectUrl = await this._authService.logout(authCookie);

    return { redirectUrl };
  }

  @Get(AuthRoutes.SignoutOidc)
  @Redirect()
  async signoutOidc() {
    return { url: this._configService.get('FRONTEND_URL') };
  }

  @Post(AuthRoutes.BackchannelLogout)
  async backchannelLogout(@Body('logout_token') logoutToken: string) {
    return this._authService.backchannelLogout(logoutToken);
  }
}
