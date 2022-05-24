import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as RootActions from './root.actions';
import * as RootSelectors from './root.selectors';

@Injectable()
export class RootFacade {
  user$ = this.store.pipe(select(RootSelectors.getUser));

  constructor(private readonly store: Store) {}

  loadUser() {
    this.store.dispatch(RootActions.loadUser());
  }
}
