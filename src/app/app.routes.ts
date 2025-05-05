import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RotationComponent } from './rotation/rotation.component';
import { OthersComponent } from './others/others.component';
import { OperationsComponent } from './operations/operations.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { SlewingComponent } from './slewing/slewing.component';
import { HoistingComponent } from './hoisting/hoisting.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'accueil', component: AcceuilComponent },
  { path: 'rotation', component: RotationComponent },
  { path: 'rotate/:engineCode', component: RotationComponent },
  { path: 'others', component: OthersComponent },
  { path: 'operations', component: OperationsComponent },
  { path: 'slewing', component: SlewingComponent },
  { path: 'hoisting', component: HoistingComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'notifications/:craneId', component: NotificationsComponent },
  
  { path: '', redirectTo: 'accueil', pathMatch: 'full' }
];
