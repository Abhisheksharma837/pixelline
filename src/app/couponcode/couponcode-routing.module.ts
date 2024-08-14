import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CouponcodePage } from './couponcode.page';

const routes: Routes = [
  {
    path: '',
    component: CouponcodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CouponcodePageRoutingModule {}
