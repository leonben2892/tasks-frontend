import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import {Actions, createEffect, ofType} from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { AuthActions } from './action-types';

@Injectable({
  providedIn: 'root'
})
export class AuthEffects {

  public login$ = createEffect(() => this.actions$
    .pipe(
      ofType(AuthActions.login),
      tap(action => localStorage.setItem('user', JSON.stringify(action.user)))
    ), {dispatch: false});

    public logout$ = createEffect(() => this.actions$
      .pipe(
        ofType(AuthActions.logout),
        tap(action => {
          localStorage.removeItem('user');
          this.router.navigateByUrl('/auth');
        })
      ), {dispatch: false});

  constructor(private router: Router, private actions$: Actions) {}
}
