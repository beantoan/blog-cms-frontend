import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NoAuthGuard} from './core/services/no-auth-guard.service';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './core/services/auth-guard.service';
import {PostComponent} from './post/post.component';

const routes: Routes = [
  {
    path: '',
    component: PostComponent,
    canActivate: [AuthGuard],
    data: {
      title: 'Posts'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [NoAuthGuard],
    data: {
      title: 'Login'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
