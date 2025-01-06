import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HowToWorkPage } from './how-to-work.page';

const routes: Routes = [
  {
    path: '',
    component: HowToWorkPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HowToWorkPageRoutingModule {}
