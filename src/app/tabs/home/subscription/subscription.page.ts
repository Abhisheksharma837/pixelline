import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.page.html',
  styleUrls: ['./subscription.page.scss'],
})
export class SubscriptionPage implements OnInit {
  selectedPlan: number = 0;

  constructor(
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

  goBack(){
    this.navCtrl.back();
  }

  selectPlan(plan: number) {
    this.selectedPlan = plan;
  }

  subscribe() {
    if (this.selectedPlan === 0) {
      alert('Please select a plan');
    } else {
      alert(`Subscribed to the ${this.selectedPlan === 1 ? '1 Year' : '2 Year'} plan!`);
    }
  }
  
}
