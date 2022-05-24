import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { NxModule } from '@nrwl/angular';
import { hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';

import * as RootActions from './root.actions';
import { RootEffects } from './root.effects';

describe('RootEffects', () => {
  let actions: Observable<Action>;
  let effects: RootEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot()],
      providers: [
        RootEffects,
        provideMockActions(() => actions),
        provideMockStore(),
      ],
    });

    effects = TestBed.inject(RootEffects);
  });

  describe('init$', () => {
    it('should work', () => {
      actions = hot('-a-|', { a: RootActions.init() });

      const expected = hot('-a-|', {
        a: RootActions.loadRootSuccess({ root: [] }),
      });

      expect(effects.init$).toBeObservable(expected);
    });
  });
});
