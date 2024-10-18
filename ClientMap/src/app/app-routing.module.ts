import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './_guards/auth.guard';

const routes: Routes = [
  {path: "login", component: LoginComponent},
  {path: "main", component: MainComponent, runGuardsAndResolvers: "always", canActivate: [AuthGuard],},
  {path: "", redirectTo: "main", pathMatch: "full"},
  {path: "**", redirectTo: "main", pathMatch: "full"},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
