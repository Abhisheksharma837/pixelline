import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-create-new-password',
  templateUrl: './create-new-password.page.html',
  styleUrls: ['./create-new-password.page.scss'],
})
export class CreateNewPasswordPage implements OnInit {

  constructor(
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
  }
  
  goBack(){
    this.navCtrl.back();
  }

}
