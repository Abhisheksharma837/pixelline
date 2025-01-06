import { Component } from '@angular/core';
import { Platform, AlertController, MenuController } from '@ionic/angular';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { App } from '@capacitor/app';
import { NavController } from '@ionic/angular'; // Use NavController
import { ToastIndicatorService } from './services/toastIndicator/toast-indicator.service';
import { ReportsService } from './services/reports/reports.service';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  private isMenuOpen: boolean = false; // Track if the menu is open
  private navigatedFromCamera = false; // Track if the user came from the camera page

  constructor(
    private platform: Platform,
    private alertCtrl: AlertController,
    private location: Location,
    private router: Router,
    private navCtrl: NavController, // Use NavController for navigation
    private toast: ToastIndicatorService,
    private menuCtrl: MenuController, // Add MenuController to control menu
    private reportService: ReportsService
  ) {
    this.initializeBackButtonCustomHandler();
    // this.subscribeToMenuStatus();
  }

  handleBackButton() {
    // Check if the menu is open
    this.menuCtrl.isOpen().then((isOpen) => {
      if (isOpen) {
        // Close the menu if it is open
        this.menuCtrl.close();
      } else {
        // Check the current route
        const currentRoute = this.router.url;
        if (currentRoute === '/home') {
          // Show exit confirmation if the menu is closed
          this.showExitConfirm();
        } else if (currentRoute === '/login') {
          this.showExitConfirm();
        } else {
          // For other pages, navigate back
          this.location.back();
        }
      }
    });
  }

  subscribeToMenuStatus() {
    // Subscribe to menu status changes
    this.reportService.menuStatus$.subscribe((isOpen) => {
      this.isMenuOpen = isOpen;
    });
  }

  // Receive menu status from home.page.ts
  // onMenuStatusChange(isOpen: boolean) {
  //   this.isMenuOpen = isOpen; // Update menu status based on the emitted value from the child
  // }

  initializeBackButtonCustomHandler(): void {
    // let isHomePage: boolean = false; // Track if the current page is home

    this.platform.backButton.subscribeWithPriority(9999, async () => {
      const currentUrl = this.router.url;
      if (currentUrl === '/home') {
        // isHomePage = true; // Set flag to true if on home page
        if (await this.menuCtrl.isOpen()) {
          // Close the side menu if it's open
          await this.menuCtrl.close();
        } else {
          this.showExitConfirm();
        }
        // this.toast.showToast('For closing the side bar please click outside the side bar ','danger','middle')

        // this.showExitConfirm(); // Handle back press on the home page
      } else if (currentUrl === '/login') {
        this.showExitConfirm();
      } else {
        // this.location.back(); // Navigate to the previous page
        // this.toast.showToast('Back button clicked', 'danger', 'top');
        // If coming from camera page to home, block back navigation
        const navigatedFromCamera = localStorage.getItem('navigatedFromCamera');
        if (
          navigatedFromCamera === 'true' &&
          currentUrl === '/home'
          // isHomePage
        ) {
          localStorage.removeItem('navigatedFromCamera');
          this.showExitConfirm();
        } else {
          this.location.back();
        }
      }
    });
  }

  async showExitConfirm() {
    // for back mobile device , when clicking back button then exit the app
    // first installing the npm install @capacitor/app
    // after that importing the App from the @capacitor/app
    // after that here we handle the App.exit
    const alert = await this.alertCtrl.create({
      header: 'Exit App',
      message: 'Do you want to exit the app?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // this.toast.showToast('Welcome back  ','danger','top');
          },
        },
        {
          text: 'Exit',
          handler: () => {
            App.exitApp();
          },
        },
      ],
    });
    await alert.present();
    const backButtonHandler = this.platform.backButton.subscribeWithPriority(
      9999,
      () => {
        alert.dismiss();
        backButtonHandler.unsubscribe(); // Remove the subscription to prevent memory leaks
      }
    );
  }

  async navigateToHome(): Promise<void> {
    // Clear the history stack before navigating to the home page
    this.location.replaceState('/home'); // This replaces the current entry in the history stack
    this.router.navigateByUrl('/home');
    this.navigatedFromCamera = true; // Set the flag before navigating
  }
}


