import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-profile-setting',
  templateUrl: './profile-setting.page.html',
  styleUrls: ['./profile-setting.page.scss'],
})
export class ProfileSettingPage implements OnInit {

  constructor(private navCtrl: NavController)
   { 

   }

  ngOnInit() {
  }

  editProfile() {
    // Navigate to edit profile page
    this.navCtrl.navigateForward('/edit-profile');
  }

  logOut() {
    // Handle logout logic
  }

  deactivateAccount() {
    // Handle account deactivation logic
  }

  resetPassword() {
    // Navigate to reset password page
    this.navCtrl.navigateForward('/reset-password');
  }

  goBack() {
    this.navCtrl.back();
  }

}
