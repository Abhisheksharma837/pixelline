import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-how-to-work',
  templateUrl: './how-to-work.page.html',
  styleUrls: ['./how-to-work.page.scss'],
})
export class HowToWorkPage implements OnInit {

  steps = [
    { title: 'Step 1', videoSrc: 'assets/videos/sample1.mp4' },
    { title: 'Step 2', videoSrc: 'assets/videos/sample1.mp4' },
    { title: 'Step 3', videoSrc: 'assets/videos/sample1.mp4' }
  ];
  constructor(
    private navCtrl: NavController,

  ) { }

  ngOnInit() {
  }

  goBack() {
    this.navCtrl.back();
  }
  swiperSlideChanged(e: any) {
    console.log('changed: ', e);
  }
  goToPreviousSlide() {
    const swiperInstance = document.querySelector('swiper-container') as any;
    if (swiperInstance && swiperInstance.swiper) {
      swiperInstance.swiper.slidePrev();
    }
  }

  goToSettingsPage() {
    console.log('Navigating to settings page');
    this.navCtrl.navigateForward('tabs/profile-setting');
  }
}
