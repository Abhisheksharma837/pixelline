import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HowToWorkPageRoutingModule } from './how-to-work-routing.module';

import { HowToWorkPage } from './how-to-work.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HowToWorkPageRoutingModule
  ],
  declarations: [HowToWorkPage],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HowToWorkPageModule {}
