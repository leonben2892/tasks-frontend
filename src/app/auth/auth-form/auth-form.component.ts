import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, noop, Observable, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { AuthActions } from '../store/action-types';
import { IsCreatingUser, IsLoggedIn, IsLoggedOut } from '../store/auth.selectors';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuthFormComponent implements OnInit, OnDestroy {
  public authForm: FormGroup;

  public IsCreatingUser$: Observable<boolean>;
  public IsLoggedIn$: Observable<boolean>;
  public IsLoggedOut$: Observable<boolean>;

  public IsSignInFailed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public IsSignUpFailed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public IsAuthInProcess: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public creatingUserFlg: boolean;

  private subscriptions: Subscription[] = [];

  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.IsCreatingUser$ = this.store.pipe(select(IsCreatingUser));
    this.IsLoggedIn$ = this.store.pipe(select(IsLoggedIn));
    this.IsLoggedOut$ = this.store.pipe(select(IsLoggedOut));

    this.subscriptions.push(this.IsCreatingUser$.pipe(tap(tmpCreatingUserflg => this.creatingUserFlg = tmpCreatingUserflg)).subscribe(noop));

    // Redirect user to tasks page if he/she is already signed in
    this.store.pipe(select(IsLoggedIn), take(1)).subscribe(res => {
      if (res) {
        this.router.navigateByUrl('/tasks');
      }
    });
  }

  public auth() {
    const formVals = this.authForm.value;
    this.resetErrorMsgs();
    this.IsAuthInProcess.next(true);
    // Sign In
    if (this.creatingUserFlg === false) {
      this.authService.login(formVals.email, formVals.password)
      .pipe(
        tap(response => {
          if (response.user) {
            this.store.dispatch(AuthActions.login({user: response.user}));
            this.router.navigateByUrl('/tasks');
          } else {
            this.IsSignInFailed.next(true);
          }
        })
      ).subscribe(() => this.IsAuthInProcess.next(false), () => this.IsSignInFailed.next(true));
    } else { // Sign Up
      this.authService.signUp(formVals.email, formVals.password)
        .pipe(
          tap(response => {
            this.store.dispatch(AuthActions.login({user: response.user}));
            this.store.dispatch(AuthActions.authenticateUser());
            this.router.navigateByUrl('/tasks');
          })
        ).subscribe(() => this.IsAuthInProcess.next(false), () => this.IsSignUpFailed.next(true));
    }
  }

  public logout() {
    this.store.dispatch(AuthActions.logout());
  }

  public toggleAuthState() {
    this.resetErrorMsgs();
    if (this.creatingUserFlg === true) {
      this.store.dispatch(AuthActions.authenticateUser());
    } else {
      this.store.dispatch(AuthActions.createUser());
    }
  }

  private resetErrorMsgs() {
    this.IsSignInFailed.next(false);
    this.IsSignUpFailed.next(false);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => {
      if (sub) {
        sub.unsubscribe();
      }
    });
  }
}
