import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  public login(email: string, password: string): Observable<{user: User}> {
    let params = new HttpParams();
    params = params.append('email', email);
    params = params.append('password', password);
    return this.http.get<{user: User}>(environment.backendUrl + 'api/auth', { params });
  }

  public signUp(email: string, password: string): Observable<{user: User}> {
    return this.http.post<{user: User}>(environment.backendUrl + 'api/user', {email, password});
  }
}
