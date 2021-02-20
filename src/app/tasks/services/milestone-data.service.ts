import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultDataService, HttpUrlGenerator, QueryParams } from '@ngrx/data';
import { Update } from '@ngrx/entity';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { environment } from 'src/environments/environment';
import { Milestone } from '../models/milestone.model';
import { Task } from '../models/task.model';

@Injectable()
export class MilestonesDataService extends DefaultDataService<Milestone> {
  constructor(http: HttpClient, httpUrlGenerator: HttpUrlGenerator, private store: Store<AppState>) {

    super('Task', http, httpUrlGenerator);
  }

  getWithQuery(queryParams: QueryParams | string): Observable<Milestone[]> {
    return this.http.get(environment.backendUrl + `api/milestone/${queryParams}`)
      .pipe(
        map((res: {payload: Milestone[]}) => res.payload)
      );
  }

  add(entity: Milestone): Observable<Milestone> {
    return this.http.post(environment.backendUrl + 'api/milestone', {taskId: entity.taskId, description: entity.description})
      .pipe(
        map((res: {payload: Milestone}) => res.payload)
      );
  }

  update(update: Update<Milestone>): Observable<Milestone> {
    const { description } = update.changes;
    return this.http.put(environment.backendUrl + `api/milestone/${update.id}`, { description })
      .pipe(
        map((res: {payload: Milestone}) => res.payload)
      );
  }

  delete(key: string): Observable<string> {
    return this.http.delete(environment.backendUrl + `api/milestone/${key}`)
    .pipe(
      map((res: {payload: Milestone}) => res.payload._id)
    );
  }
}
