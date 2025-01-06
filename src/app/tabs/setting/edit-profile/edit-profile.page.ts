import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';
import { ToastIndicatorService } from 'src/app/services/toastIndicator/toast-indicator.service';
import { UserDetailsService } from 'src/app/services/user/user-details.service';

interface imagePreview {
  image?: string;
  extension: string;

}
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  profileImage: string = '/assets/logo/default-image.jpeg'; // Default image path
  name: string = '';
  email: string = '';
  dob: string = '';
  gender: string = '';

  constructor(
    private navCtrl: NavController,
    public router: Router,
    private userDetailsService: UserDetailsService,
    private toast: ToastIndicatorService,

     private data:DataService
  ) { }

  ngOnInit() {
    this.getUserDetails();
  }

  goBack() {
    this.navCtrl.back();
  }
  async openGallery() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos // Opens the gallery
      });
      if (image && image.dataUrl) {
        this.profileImage = image.dataUrl; // Update profile image with selected image
        console.log("Profile image:",this.profileImage);
        
      }
    } catch (error) {
      console.error("Error selecting image from gallery", error);
    }
  }

  getUserDetails() {
    this.userDetailsService.getUserDetails().subscribe((details) => {
      if (details) {
        this.name = details.name;
        this.email = details.email;
        this.profileImage = details.image;
        this.dob = details.dob;
        this.gender = details.gender;
      }
    });
  }

  saveProfile() {
    const updatedData = {
      name: this.name,
      image: this.profileImage,
      dob: this.dob,
      gender: this.gender
    };
    this.userDetailsService.updateUserProfile(updatedData).subscribe(
      (response) => {
        console.log("Profile updated successfully:", response);
        this.toast.showToast('Profile updated successfully:','success','top')
      },
      (error) => {
        console.error("Error updating profile:", error);
        this.toast.showToast('Error updating profile','danger','top')
      }
    );
  }
  logout(){
  }
}
