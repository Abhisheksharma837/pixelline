import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DefaultFileNamePageRoutingModule } from './default-file-name-routing.module';

import { DefaultFileNamePage } from './default-file-name.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DefaultFileNamePageRoutingModule
  ],
  declarations: [DefaultFileNamePage]
})
export class DefaultFileNamePageModule {}
