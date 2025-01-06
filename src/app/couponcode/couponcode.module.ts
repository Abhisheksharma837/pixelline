import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CouponcodePageRoutingModule } from './couponcode-routing.module';

import { CouponcodePage } from './couponcode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CouponcodePageRoutingModule
  ],
  declarations: [CouponcodePage]
})
export class CouponcodePageModule { }
