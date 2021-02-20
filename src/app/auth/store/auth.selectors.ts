import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './reducers';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const IsLoggedIn = createSelector (
  selectAuthState,
  auth => auth.user ? true : false
);

export const IsLoggedOut = createSelector(
  IsLoggedIn,
  loggedIn => loggedIn ? false : true
);

export const getUser = createSelector(
  selectAuthState,
  state => state.user
);

export const IsCreatingUser = createSelector(
  selectAuthState,
  state => state.IsCreatingUser
);
