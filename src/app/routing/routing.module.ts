import { AuthGuard } from './../auth/auth.guard';
import { PostsComponent } from './../posts/posts.component';
import { PostsListComponent } from './../posts-list/posts-list.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from '../auth/login/login.component';
import { SignupComponent } from '../auth/signup/signup.component';

const routes: Routes = [
  { path: '', component:  PostsComponent, canActivate: [AuthGuard]},
  { path: 'load', component:  PostsListComponent, canActivate: [AuthGuard]},
  { path: 'edit/:postId', component: PostsComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "signup", component: SignupComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class RoutingModule { }
