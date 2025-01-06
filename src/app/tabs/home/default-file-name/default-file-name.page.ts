import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-default-file-name',
  templateUrl: './default-file-name.page.html',
  styleUrls: ['./default-file-name.page.scss'],
})
export class DefaultFileNamePage implements OnInit {

  constructor(private navctrl:NavController) { }

  ngOnInit() {
  }
  goBack(){
   this.navctrl.back()
  }
}
