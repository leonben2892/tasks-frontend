import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { noop, Observable, Subject, Subscription } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { getUser } from 'src/app/auth/store/auth.selectors';
import { AppState } from 'src/app/reducers';
import { Task } from '../models/task.model';
import { TaskEntityService } from '../services/task-entity.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksComponent implements OnInit, OnDestroy {

  public loading$: Observable<boolean>;
  public tasks$: Observable<Task[]>;

  public IsOnCompleteDisplay = false;


  private task: Task;
  public taskForm: FormGroup;
  public formMode: 'create' | 'update';

  public ngDestroyed$ = new Subject();

  constructor(private fb: FormBuilder, private tasksService: TaskEntityService, private store: Store<AppState>) { }

  ngOnInit(): void {
    this.initForm();
    this.initData();
  }

  private initForm() {
    this.taskForm = this.fb.group({
      subject: [null, [Validators.required]],
      description: [null, [Validators.required]],
      importance: [0, [Validators.required]],
      image: [null, [Validators.required]],
      isCompleted: [null]
    });
  }

  private initData() {
    this.loading$ = this.tasksService.loading$;
    this.tasks$ = this.tasksService.entities$
    .pipe(
      map(tasks => tasks.filter(task => task.isCompleted === false))
    );
  }

  onCreateTask() {
    this.formMode = 'create';
    this.taskForm.reset();
    this.taskForm.patchValue({ importance: 0 });
  }

  /* Load data of the updated task into the form */
  public onUpdateTask(task: Task) {
    this.formMode = 'update';
    this.task = task;
    this.taskForm.setValue({
      subject: this.task.subject,
      description: this.task.description,
      importance: this.task.importance,
      image: this.task.image,
      isCompleted: this.task.isCompleted
    });
  }

  /* Switch between not completed & completed tasks */
  public switchTasks(IsCompleted: boolean) {
    this.IsOnCompleteDisplay = IsCompleted;
    this.tasks$ = this.tasksService.entities$
      .pipe(
        map(tasks => tasks.filter(task => task.isCompleted === IsCompleted))
      );
  }

  public onSubmit() {
    if (this.taskForm.invalid || this.taskForm.get('importance').value === 0) {
      return;
    }

    if (this.formMode === 'update') {
      this.updateTask();
    } else {
      this.createTask();
    }

    this.taskForm.reset();
  }

  /* Execute when user is in update task mode */
  private updateTask() {
    $('#formModal').modal('hide');

    const task: Task = {
      _id: this.task._id,
      ...this.taskForm.value
    };

    this.tasksService.update(task);
  }

  /* Execute when user is in create task mode */
  private createTask() {
    let userId: string;
    this.store
      .pipe(
        select(getUser),
        tap(user => userId = user._id),
        takeUntil(this.ngDestroyed$)
      )
      .subscribe(noop);

    const task: Task = {
      userId,
      ...this.taskForm.value
    };

    this.tasksService.add(task);

    this.tasksService.loading$.pipe(takeUntil(this.ngDestroyed$)).subscribe(res => {
      if (res === false) {
        $('#formModal').modal('hide');
      }
    });
  }

  /* Execute when deleting task */
  public onDeleteTask(taskId: string) {
    this.tasksService.delete(taskId);
  }

  ngOnDestroy() {
    this.ngDestroyed$.next();
  }

}
