import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import { MilestoneEntityService } from '../../services/milestone-entity.service';
import { TaskEntityService } from '../../services/task-entity.service';
import { Task } from '../../models/task.model';
import { Milestone } from '../../models/milestone.model';

@Component({
  selector: 'app-milestone',
  templateUrl: './milestone.component.html',
  styleUrls: ['./milestone.component.scss']
})
export class MilestoneComponent implements OnInit, OnDestroy {
  public milestoneForm: FormGroup;
  public formMode: 'create' | 'update' = 'create';

  private taskId: string;
  private updatedMilestoneId: string;
  public task$: Observable<Task>;
  public milestones$: Observable<Milestone[]>;
  public loading$: Observable<boolean>;

  private IsMilestonesInLoadingProcess = false;

  public ngDestroyed$ = new Subject();

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private tasksService: TaskEntityService,
              private milestonesService: MilestoneEntityService) { }

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id');

    this.task$ = this.tasksService.entities$
      .pipe(
        map(tasks => tasks.find(task => task._id === this.taskId))
      );

    this.milestones$ = this.milestonesService.entities$
      .pipe(
        tap(milestones => {
          if (this.IsMilestonesInLoadingProcess === false) {
            this.IsMilestonesInLoadingProcess = true;
            this.loadMilestones(this.taskId);
          }
        }),
        map(milestones => milestones.filter(milestone => milestone.taskId === this.taskId))
      );

      this.loading$ = this.milestonesService.loading$;

    this.initForm();
  }

  private initForm() {
    this.milestoneForm = this.fb.group({
      description: ['', [Validators.required]]
    });
  }

  public toggleFormMode(mode: string, milestone?: Milestone) {
    if (mode === 'create') {
      this.formMode = 'create';
      this.milestoneForm.reset();
    } else {
      this.formMode = 'update';
      this.updatedMilestoneId = milestone._id;
      this.milestoneForm.patchValue({description: milestone.description});
    }
  }

  private loadMilestones(taskId: string) {
    this.milestonesService.getWithQuery(taskId);
  }

  public onDeleteMilestone(milestoneId: string) {
    this.milestonesService.delete(milestoneId);
  }

  public onSubmit() {
    if (this.milestoneForm.valid) {

      const milestone: Milestone = {_id: null, taskId: null, description: null, date: null};

      // on create
      if (this.formMode === 'create') {
        milestone.taskId = this.taskId;
        milestone.description = this.milestoneForm.get('description').value;
        this.milestonesService.add(milestone);
        this.tasksService.loading$.pipe(takeUntil(this.ngDestroyed$)).subscribe(res => {
          if (res === false) {
            $('#formModal').modal('hide');
          }
        });
      } else { // on update
        milestone._id = this.updatedMilestoneId;
        milestone.description = this.milestoneForm.get('description').value;
        this.milestonesService.update(milestone);
        $('#formModal').modal('hide');
      }

      this.milestoneForm.reset();
    }
  }

  ngOnDestroy() {
    this.ngDestroyed$.next();
  }

}
