import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { TaskEntityService } from './task-entity.service';

@Injectable()
export class TasksResolver implements Resolve<boolean> {

  constructor(private tasksService: TaskEntityService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    return this.tasksService.loaded$
      .pipe(
        tap(loaded => {
          if (loaded === false) {
            this.tasksService.getAll();
          }
        }),
        filter(loaded => loaded === true),
        first()
      );
  }
}
