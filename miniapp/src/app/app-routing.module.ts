import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { TapComponent } from './tap/tap.component';
import { TasksComponent } from './tasks/tasks.component';
import { FarmComponent } from './farm/farm.component';
import { AirDropComponent } from './airdrop/airdrop.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'tap', component: TapComponent, canActivate: [AuthGuard] },
  { path: 'tasks', component: TasksComponent, canActivate: [AuthGuard] },
  { path: 'farm', component: FarmComponent, canActivate: [AuthGuard] },
  { path: 'airdrop', component: AirDropComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
