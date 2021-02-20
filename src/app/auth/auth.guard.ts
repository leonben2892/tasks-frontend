import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { select, Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { IsLoggedIn } from './store/auth.selectors';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private store: Store<AppState>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store
      .pipe(
        select(IsLoggedIn),
        tap(loggedIn => {
          if (loggedIn === false) {
            this.router.navigateByUrl('/');
          }
        })
      );
  }
}
