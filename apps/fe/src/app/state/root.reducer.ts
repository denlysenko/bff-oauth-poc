import { createReducer, on, Action } from '@ngrx/store';
import * as RootActions from './root.actions';
import { User } from '../models/user.model';

export const ROOT_FEATURE_KEY = 'root';

export interface RootState {
  user: User | null;
}

export const initialState: RootState = {
  user: null,
};

const rootReducer = createReducer(
  initialState,
  on(RootActions.loadUserSuccess, (state, { user }) => ({ ...state, user }))
);

export function reducer(state: RootState | undefined, action: Action) {
  return rootReducer(state, action);
}
