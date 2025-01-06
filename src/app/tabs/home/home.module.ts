import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { RouterModule } from '@angular/router';
import { SignupPageRoutingModule } from 'src/app/signup/signup-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SignupPageRoutingModule,
    RouterModule,

  ],
  declarations: [HomePage],
   schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HomePageModule {}
