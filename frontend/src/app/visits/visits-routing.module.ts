
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisitListComponent } from './visit-list/visit-list.component';
import { VisitFormComponent } from './visit-form/visit-form.component';

const routes: Routes = [
  {
    path: 'patient/:patientId',
    component: VisitListComponent
  },
  {
    path: 'patient/:patientId/new',
    component: VisitFormComponent
  },
  {
    path: 'edit/:id',
    component: VisitFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitsRoutingModule { }
