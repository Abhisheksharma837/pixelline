import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CouponcodePageRoutingModule } from './couponcode-routing.module';

import { CouponcodePage } from './couponcode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CouponcodePageRoutingModule
  ],
  declarations: [CouponcodePage]
})
export class CouponcodePageModule {}
