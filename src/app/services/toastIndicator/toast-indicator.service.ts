import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastIndicatorService {
  private toast: HTMLIonToastElement | null = null;


  constructor(private toastController: ToastController) { }

  async showToast(message: string, color: 'success' | 'danger' = 'success', position: 'top' | 'bottom' | 'middle' = 'top') {
    if (this.toast) {
      await this.toast.dismiss(); // Dismiss any existing toast before showing a new one
    }
    
    this.toast = await this.toastController.create({
      message: message,
      duration: 2000, // Adjust duration as needed
      position: position,
      color: color,
      // buttons: [{ text: 'Close', role: 'cancel' }]
    });

    await this.toast.present();
  }

  async hideToast() {
    if (this.toast) {
      await this.toast.dismiss();
      this.toast = null;
    }
  }
}
