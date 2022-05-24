import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ROOT_FEATURE_KEY, RootState } from './root.reducer';

export const getRootState = createFeatureSelector<RootState>(ROOT_FEATURE_KEY);

export const getUser = createSelector(
  getRootState,
  (state: RootState) => state.user
);
