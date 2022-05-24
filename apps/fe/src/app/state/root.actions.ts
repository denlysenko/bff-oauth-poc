import { createAction, props } from '@ngrx/store';
import { User } from '../models/user.model';

export const loadUser = createAction('[Root] Load User');

export const loadUserSuccess = createAction(
  '[Root] Load User Success',
  props<{ user: User }>()
);

export const loadUserError = createAction(
  '[Root] Load User Error',
  props<{ error: any }>()
);
