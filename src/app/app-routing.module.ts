import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { ChatComponent } from './chat/chat-component/chat.component';
import { AuthGuard } from './auth/AuthGuard.guard';


const routes: Routes = [
  { path: "", component: LoginComponent },
  { path: "chat", component: ChatComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
