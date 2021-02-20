import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { TasksRoutingModule } from './tasks-routing.module';

import { TasksComponent } from './tasks/tasks.component';
import { MilestoneComponent } from './tasks/milestone/milestone.component';
import { TasksResolver } from './services/tasks.resolver';
import { compareTasks, Task } from './models/task.model';
import { compareMilestones, Milestone } from './models/milestone.model';

import { EntityDataModule, EntityDataService, EntityMetadataMap } from '@ngrx/data';
import { TasksDataService } from './services/tasks-data.service';
import { MilestonesDataService } from './services/milestone-data.service';

const entityMetadata: EntityMetadataMap = {
  Task: {
    selectId: (task: Task) => task._id,
    sortComparer: compareTasks,
    entityDispatcherOptions: {
      optimisticUpdate: true
    }
  },
  Milestone: {
    selectId: (milestone: Milestone) => milestone._id,
    sortComparer: compareMilestones,
    entityDispatcherOptions: {
      optimisticUpdate: true
    }
  }
};

@NgModule({
  declarations: [TasksComponent, MilestoneComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TasksRoutingModule,
    EntityDataModule.forRoot({
      entityMetadata
    })
  ],
  providers: [
    TasksResolver,
    TasksDataService,
    MilestonesDataService
  ]
})
export class TasksModule {
  constructor(private entityDataSevice: EntityDataService,
              private tasksDataService: TasksDataService,
              private milestonesDataService: MilestonesDataService) {
    entityDataSevice.registerService('Task', tasksDataService);
    entityDataSevice.registerService('Milestone', milestonesDataService);
  }
}
