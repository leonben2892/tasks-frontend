import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TasksComponent } from './tasks/tasks.component';
import { MilestoneComponent } from './tasks/milestone/milestone.component';
import { AuthGuard } from '../auth/auth.guard';
import { TasksResolver } from './services/tasks.resolver';

const routes: Routes = [
  { path: 'tasks', children: [
      { path: '', component: TasksComponent, canActivate: [AuthGuard], resolve: { tasks: TasksResolver }, pathMatch: 'full' },
      { path: ':id', component: MilestoneComponent, canActivate: [AuthGuard], resolve: { tasks: TasksResolver } }
    ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TasksRoutingModule {}
