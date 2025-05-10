import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RotationComponent } from './rotation/rotation.component';
import { OthersComponent } from './others/others.component';
import { OperationsComponent } from './operations/operations.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { SlewingComponent } from './slewing/slewing.component';
import { HoistingComponent } from './hoisting/hoisting.component';
import { SupensionComponent } from './supension/supension.component';
import { PortsComponent } from './ports/ports.component';
import { EnginesTypesComponent } from './engines-types/engines-types.component';
import { ThreedTempsReelPageComponent } from './threed-temps-reel-page/threed-temps-reel-page.component';
import { PortSupervisionComponent } from './port-supervision/port-supervision.component';
import { ChoixSupervisionComponent } from './choix-supervision/choix-supervision.component';
import { TestComponent } from './test/test.component';


export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'accueil', component: AcceuilComponent },
  { path: 'rotation', component: RotationComponent },
  // { path: 'rotate/:engineCode', component: RotationComponent },
  { path: 'operations/:engineCode', component: OperationsComponent},
  { path: 'supension/:engineCode', component: SupensionComponent},
  {path:'ports' , component:PortsComponent},
  {path:'enginesTypes' , component:EnginesTypesComponent},
  {path:'portSupervision' , component:PortSupervisionComponent},
  { path: 'choixSupervision' , component:ChoixSupervisionComponent},
  { path: 'others', component: OthersComponent },
  { path: 'operations', component: OperationsComponent },
  { path: 'slewing', component: SlewingComponent },
  { path: 'slewing/:engineCode', component: SlewingComponent },
  { path: 'hoisting', component: HoistingComponent },
  { path: 'hoisting/:engineCode', component: HoistingComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'notifications/:craneId', component: NotificationsComponent },
  { path: 'supension', component: SupensionComponent },
  { path: 'threedTempsReelPage', component: ThreedTempsReelPageComponent },
  {path: 'test' , component: TestComponent},


  
  { path: '', redirectTo: 'accueil', pathMatch: 'full' }
];
