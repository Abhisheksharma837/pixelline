import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.page.html',
  styleUrls: ['./terms-condition.page.scss'],
})
export class TermsConditionPage implements OnInit {

  constructor(
   private navctrl:NavController
  ) { }

  ngOnInit() {
  }
  goBack(){
    this.navctrl.back()
  }
}
