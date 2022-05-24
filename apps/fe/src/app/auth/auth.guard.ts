import { Injectable } from '@angular/core';
import { CanActivate, CanLoad } from "@angular/router";
import { filter, map, Observable, take, tap } from 'rxjs';
import { RootFacade } from '../state/root.facade';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private readonly _rootFacade: RootFacade) {}

  canActivate(): Observable<boolean> {
    return this._rootFacade.user$.pipe(
      tap((user) => {
        if (user === null) {
          this._rootFacade.loadUser();
        }
      }),
      filter((user) => user !== null),
      map(() => true),
      take(1)
    );
  }

  canLoad(): Observable<boolean> {
    return this._rootFacade.user$.pipe(
      tap((user) => {
        if (user === null) {
          this._rootFacade.loadUser();
        }
      }),
      filter((user) => user !== null),
      map(() => true),
      take(1)
    );
  }
}
