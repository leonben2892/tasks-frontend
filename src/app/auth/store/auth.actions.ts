import { createAction, props } from '@ngrx/store';

import { User } from '../models/user.model';

export const login = createAction(
  '[Auth Page] User Login',
  props<{user: User}>()
);

export const logout = createAction(
  '[Auth Page] User Logout'
);

export const createUser = createAction(
  '[Auth Page] Create User'
);

export const authenticateUser = createAction(
  '[Auth Page] Authenticate User'
);
