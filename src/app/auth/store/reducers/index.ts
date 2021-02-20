import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createReducer,
  createSelector,
  MetaReducer,
  on
} from '@ngrx/store';

import { User } from '../../models/user.model';
import { AuthActions } from '../action-types';

export const authFeatureKey = 'auth';

export interface AuthState {
  user: User;
  IsCreatingUser: boolean;
}

export const initialAuthState: AuthState = {
  user: undefined,
  IsCreatingUser: false
};

export const authRecuder = createReducer(
  initialAuthState,

  on(AuthActions.login, (state, action) => {
    return {
      user: action.user,
      IsCreatingUser: state.IsCreatingUser
    };
  }),

  on(AuthActions.logout, (state, action) => {
    return {
      user: undefined,
      IsCreatingUser: state.IsCreatingUser
    };
  }),

  on(AuthActions.createUser, (state, action) => {
    return {
      user: state.user,
      IsCreatingUser: true
    };
  }),

  on(AuthActions.authenticateUser, (state, action) => {
    return {
      user: state.user,
      IsCreatingUser: false
    };
  })
);
