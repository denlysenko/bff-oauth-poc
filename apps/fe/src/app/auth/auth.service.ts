import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginResponse, LogoutResponse } from './auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly _http: HttpClient) {}

  login(): Observable<LoginResponse> {
    return this._http
      .post<LoginResponse>('/api/login', {})
      .pipe(tap(({ redirectUrl }) => location.assign(redirectUrl)));
  }

  logout(): Observable<LogoutResponse> {
    return this._http
      .post<LogoutResponse>('/api/logout', {})
      .pipe(tap(({ redirectUrl }) => location.assign(redirectUrl)));
  }
}
