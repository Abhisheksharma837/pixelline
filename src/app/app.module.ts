import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AuthService } from './services/auth/auth.service';
import { DataService } from './services/data/data.service';
import { QRScanner } from '@ionic-native/qr-scanner/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx'; // Import FileOpener
import { userInterceptor } from './intercepter/user.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [ 
    BrowserModule,
    ReactiveFormsModule, 
    IonicModule.forRoot(), 
    IonicStorageModule.forRoot(),
    AppRoutingModule],
  providers: [
    provideHttpClient(withInterceptors([userInterceptor])),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AuthService,
    DataService,
    QRScanner,
    FileOpener // Add FileOpener to providers
  ],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
