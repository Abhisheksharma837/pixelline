import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  { //By default Importing routing in this home-routing.module
    path: 'profile-setting',
    loadChildren: () => import('./setting/profile-setting/profile-setting.module').then( m => m.ProfileSettingPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./setting/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
