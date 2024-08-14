import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateNewPasswordPageRoutingModule } from './create-new-password-routing.module';

import { CreateNewPasswordPage } from './create-new-password.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateNewPasswordPageRoutingModule
  ],
  declarations: [CreateNewPasswordPage]
})
export class CreateNewPasswordPageModule {}
