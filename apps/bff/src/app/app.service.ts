import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly _httpService: HttpService,
    private readonly _configService: ConfigService
  ) {}

  userInfo(accessToken: string) {
    return new Promise((resolve, reject) => {
      const url = `${this._configService.get(
        'ISSUER_URL'
      )}/protocol/openid-connect/userinfo`;

      this._httpService
        .get(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .subscribe({
          next: (response) => {
            resolve(response.data);
          },
          error: (error) => {
            reject(error);
          },
        });
    });
  }
}
