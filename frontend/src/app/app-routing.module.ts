import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/patients',
    pathMatch: 'full'
  },
  {
    path: 'patients',
    loadChildren: () => import('./patients/patients.module').then(m => m.PatientsModule)
  },
  {
    path: 'visits',
    loadChildren: () => import('./visits/visits.module').then(m => m.VisitsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
