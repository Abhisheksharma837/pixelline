import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.page.html',
  styleUrls: ['./contact-us.page.scss'],
})
export class ContactUsPage implements OnInit {

  constructor(
    private navCtrl: NavController,

  ) { }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.back();
  }
}
