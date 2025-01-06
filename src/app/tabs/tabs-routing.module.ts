import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children:[
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
      },
      {
        path: 'profile-setting',
        loadChildren: () => import('./setting/profile-setting/profile-setting.module').then( m => m.ProfileSettingPageModule)
      },
      {
        path: 'edit-profile',
        loadChildren: () => import('./setting/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
      },
      {
        path: 'folders',
        loadChildren: () => import('./folders/folders.module').then( m => m.FoldersPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
