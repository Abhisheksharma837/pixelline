import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from 'src/app/intercepter/intercepter.service';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AuthService } from './services/auth/auth.service';
import { DataService } from './services/data/data.service';


@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule, 
    BrowserModule,
    ReactiveFormsModule, 
    IonicModule.forRoot(), 
    IonicStorageModule.forRoot(),
    AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor , multi: true },
    AuthInterceptor,
    AuthService,
    DataService,
    
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
