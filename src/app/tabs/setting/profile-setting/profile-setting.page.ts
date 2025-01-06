import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/data/data.service';
import { ToastIndicatorService } from 'src/app/services/toastIndicator/toast-indicator.service';


@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.page.html',
  styleUrls: ['./profile-setting.page.scss'],
})
export class ProfileSettingPage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private data: DataService,
    private router: Router,
    protected auth: AuthService,
    private alertCtrl: AlertController,
    private toast: ToastIndicatorService,
    private platform: Platform,   // using this for after navigate from coupon code page to home page & clicking back button in devices then preventing for again naviagate abck to coupon code page,

    // private toster: IndicatorService,



  ) { }

  ngOnInit() {
  }
  howToWork() {
    this.navCtrl.navigateForward('/how-to-work');
  }
  helpPage() {
    this.navCtrl.navigateForward('/help-page')
  }
  editProfile() {
    // Navigate to edit profile page
    this.navCtrl.navigateForward('/edit-profile');
  }
  defaultFile(){
    this.navCtrl.navigateForward('/default-file-name');
  }
  termsCondition(){
    this.navCtrl.navigateForward('/terms-condition');
  }
  privacyPolicy() {
    this.navCtrl.navigateForward('/privacy')
  }
  contactUs(){
    this.navCtrl.navigateForward('/contact-us')
  }
  async logOut() {
    const alertBox = await this.alertCtrl.create({
      header: 'Confirm Logout?',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Logout',
          handler: () => {
            this.data.remove('token');
            this.data.remove('userid');
            this.data.remove('userimage');
            this.data.remove('isLoggedIn');  // Clear login status
            this.auth.token = '';
            this.auth.userid = '';
            this.auth.userImage = '';
            this.auth.username = '';
            this.router.navigate(['/login']);
            this.toast.showToast('Logout Successfully');
          },
        },
      ],
    });
    await alertBox.present();
    const backButtonHandler = this.platform.backButton.subscribeWithPriority(9999, () => {
      alertBox.dismiss();
      backButtonHandler.unsubscribe(); // Remove the subscription to prevent memory leaks
    });
  }

  async deactivateAccount() {
    // Handle account deactivation logic
    const alertBox = await this.alertCtrl.create({
      header: 'Confirm Deactivate Account?',
      message: 'Are you sure you want to deactivate your account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Deactivate',
          handler: () => {
            this.data.remove('token');
            this.data.remove('userid');
            this.data.remove('userimage');
            this.router.navigate(['/login']);
            this.auth.token = '';
            this.auth.userid = '';
            this.auth.userImage = '';
            this.auth.username = '';
            // this.toster.showToast('Certificate Deleted Successfully');
          },
        },
      ],
    });
    await alertBox.present();
    const backButtonHandler = this.platform.backButton.subscribeWithPriority(9999, () => {
      alertBox.dismiss();
      backButtonHandler.unsubscribe(); // Remove the subscription to prevent memory leaks
    });
  }

  resetPassword() {
    // Navigate to reset password page
    this.navCtrl.navigateForward('/forget-password');
  }

  goBack() {
    this.navCtrl.back();
  }

}
