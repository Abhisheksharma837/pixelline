import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'walkthrough',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'couponcode',
    loadChildren: () => import('./couponcode/couponcode.module').then( m => m.CouponcodePageModule)
  },
  {
    path: 'walkthrough',
    loadChildren: () => import('./walkthrough/walkthrough.module').then( m => m.WalkthroughPageModule)
  },
  {
    path: 'forget-password',
    loadChildren: () => import('./forget-password/forget-password.module').then( m => m.ForgetPasswordPageModule)
  },
  {
    path: 'create-new-password',
    loadChildren: () => import('./create-new-password/create-new-password.module').then( m => m.CreateNewPasswordPageModule)
  },
  {
    path: 'profile-setting',
    loadChildren: () => import('./home/setting/profile-setting/profile-setting.module').then( m => m.ProfileSettingPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./home/setting/edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },

 
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
