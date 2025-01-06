import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'walkthrough',
    pathMatch: 'full'
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
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.module').then( m => m.TabsPageModule)
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
    path: 'history',
    loadChildren: () => import('./tabs/home/history/history.module').then( m => m.HistoryPageModule)
  },
  {
    path: 'how-to-work',
    loadChildren: () => import('./tabs/home/how-to-work/how-to-work.module').then( m => m.HowToWorkPageModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./tabs/home/contact-us/contact-us.module').then( m => m.ContactUsPageModule)
  },
  {
    path: 'help-page',
    loadChildren: () => import('./tabs/home/help-page/help-page.module').then( m => m.HelpPagePageModule)
  },
  {
    path: 'privacy',
    loadChildren: () => import('./tabs/home/privacy/privacy.module').then( m => m.PrivacyPageModule)
  },
  {
    path: 'subscription',
    loadChildren: () => import('./tabs/home/subscription/subscription.module').then( m => m.SubscriptionPageModule)
  },
  {
    path: 'camera',
    loadChildren: () => import('./tabs/home/camera/camera.module').then( m => m.CameraPageModule)
  },
  {
    path: 'terms-condition',
    loadChildren: () => import('./tabs/home/terms-condition/terms-condition.module').then( m => m.TermsConditionPageModule)
  },
  {
    path: 'default-file-name',
    loadChildren: () => import('./tabs/home/default-file-name/default-file-name.module').then( m => m.DefaultFileNamePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
