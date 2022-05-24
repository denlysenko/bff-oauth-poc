import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { catchError, EMPTY, exhaustMap, map, of, switchMap } from 'rxjs';
import * as RootActions from './root.actions';
import { UserService } from '../services/user.service';
import { AuthService } from '../auth/auth.service';
import { HttpStatusCode } from '@angular/common/http';

@Injectable()
export class RootEffects {
  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RootActions.loadUser),
      exhaustMap(() =>
        this._userService.getUser().pipe(
          map((user) => RootActions.loadUserSuccess({ user })),
          catchError(({ error }) => {
            if (error.statusCode === HttpStatusCode.Unauthorized) {
              return this._authService.login().pipe(switchMap(() => EMPTY));
            }

            return of(RootActions.loadUserError({ error }));
          })
        )
      )
    )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly _userService: UserService,
    private readonly _authService: AuthService
  ) {}
}
