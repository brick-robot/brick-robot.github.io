import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { TapComponent } from './tap/tap.component';
import { TasksComponent } from './tasks/tasks.component';
import { FarmComponent } from './farm/farm.component';
import { AirDropComponent } from './airdrop/airdrop.component';
import { TelegramService } from './services/telegram.service';
import { LoadingComponent } from './loading/loading.component';
import { BottomNavigationComponent } from './bottom-navigation/bottom-navigation.component';
 @NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    TapComponent,
    TasksComponent,
    FarmComponent,
    AirDropComponent,
    LoadingComponent,
    BottomNavigationComponent
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
