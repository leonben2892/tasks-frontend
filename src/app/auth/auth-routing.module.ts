import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthFormComponent } from './auth-form/auth-form.component';

const routes: Routes = [
  { path: 'auth', component: AuthFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
