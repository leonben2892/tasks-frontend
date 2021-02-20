import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {  map, take } from 'rxjs/operators';
import { getUser } from 'src/app/auth/store/auth.selectors';
import { AppState } from 'src/app/reducers';
import { environment } from 'src/environments/environment';
import { Task } from '../models/task.model';

@Injectable()
export class TasksDataService extends DefaultDataService<Task> {

  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator, private store: Store<AppState>) {
    super('Task', http, httpUrlGenerator);
  }

  getAll(): Observable<Task[]> {
    let userId: string;
    this.store.pipe(select(getUser), take(1)).subscribe(user => userId = user._id);
    return this.http.get(environment.backendUrl + `api/task/?userId=` + userId)
      .pipe(
        map((res: {payload: Task[]}) => res.payload)
      );
  }

  update(update: Update<Task>): Observable<Task> {
    const { subject, description, importance, image, isCompleted } = update.changes;
    return this.http.put(environment.backendUrl + `api/task/${update.id}`, { subject, description, importance, image, isCompleted })
      .pipe(
        map((res: {payload: Task}) => res.payload)
      );
  }

  add(entity: Task): Observable<Task> {
    return this.http.post(environment.backendUrl + 'api/task', entity)
      .pipe(
        map((res: {payload: Task}) => res.payload)
      );
  }

  delete(key: string): Observable<string> {
    return this.http.delete(environment.backendUrl + `api/task/${key}`)
      .pipe(
        map((res: {payload: Task}) => res.payload._id)
      );
  }
}
