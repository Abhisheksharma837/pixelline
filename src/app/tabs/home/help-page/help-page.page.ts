import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.page.html',
  styleUrls: ['./help-page.page.scss'],
})
export class HelpPagePage implements OnInit {

  constructor(
    private navCtrl : NavController,
  ) { }

  ngOnInit() {
  }

  goBack(){
    this.navCtrl.back();
  }
}
