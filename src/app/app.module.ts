import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { LoginErrorComponent } from './auth/login-error/login-error.component';
import { ChatComponent } from './chat/chat-component/chat.component';
import { MessageBubbleComponent } from './chat/message-bubble/message-bubble.component';
import { DotsComponent } from './util/dots-component/dots.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LoginErrorComponent,
    ChatComponent,
    MessageBubbleComponent,
    DotsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
