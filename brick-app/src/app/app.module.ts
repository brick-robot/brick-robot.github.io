import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import { TapComponent } from './tap/tap.component';
import { TasksComponent } from './tasks/tasks.component';
import { FarmComponent } from './farm/farm.component';
import { SquadComponent } from './squad/squad.component';
import { TelegramService } from './services/telegram.service';
 @NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    MainMenuComponent,
    TapComponent,
    TasksComponent,
    FarmComponent,
    SquadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
   ],
  providers: [TelegramService],
  bootstrap: [AppComponent]
})
export class AppModule { }
