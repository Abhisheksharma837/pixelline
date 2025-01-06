import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultFileNamePage } from './default-file-name.page';

const routes: Routes = [
  {
    path: '',
    component: DefaultFileNamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefaultFileNamePageRoutingModule {}
