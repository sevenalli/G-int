import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RotationComponent } from './rotation/rotation.component';
import { OthersComponent } from './others/others.component';
import { OperationsComponent } from './operations/operations.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'rotation', component: RotationComponent },
  { path: 'rotate/:engineCode', component: RotationComponent },
  { path: 'others', component: OthersComponent },
  { path: 'operations', component: OperationsComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }
];
