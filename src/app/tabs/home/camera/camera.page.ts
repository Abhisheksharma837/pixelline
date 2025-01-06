import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { NavController, Platform, ActionSheetController } from '@ionic/angular';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ToastIndicatorService } from 'src/app/services/toastIndicator/toast-indicator.service';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { PDFDocument, rgb } from 'pdf-lib';
import { Storage } from '@capacitor/storage';
import { Preferences } from '@capacitor/preferences';
import { ReportsService } from 'src/app/services/reports/reports.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Capacitor, Plugins } from '@capacitor/core';
const { CamerPreview } = Plugins;
import {
  CameraPreview,
  CameraPreviewOptions,
  CameraPreviewPictureOptions,
} from '@capacitor-community/camera-preview';
import '@capacitor-community/camera-preview';
import { NavigationExtras } from '@angular/router';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.page.html',
  styleUrls: ['./camera.page.scss'],
})
export class CameraPage implements OnInit {
  photo: string | undefined = undefined;
  @ViewChild('imageContainer', { read: ElementRef })
  imageContainer!: ElementRef;
  capturedImages: string[] = [];
  selectedImages: string[] = []; // Store multiple images

  selectedOption: string = 'Document';
  flashMode: 'on' | 'off' | 'auto' = 'off';
  isCameraOpen = false; // Flag to indicate if the camera preview is open
  capturedImage: string | undefined = undefined;
  image = '';
  cameraActive = false;
  //kya haal hai pradhan

  constructor(
    private navCtrl: NavController,
    private platform: Platform,
    private sanitizer: DomSanitizer,
    private actionSheetController: ActionSheetController, // Inject ActionSheetController
    private toast: ToastIndicatorService,
    private reportService: ReportsService,
    private router: Router,
    private alertController: AlertController, // Inject AlertController
    private appComponent: AppComponent,
    private navController: NavController,
    private Location: Location
  ) {}

  ngOnInit() {
    // this.startCameraProcess(); // Automatically opens the camera when the page loads
    this.takePhoto();
  }
  async goBack() {
    // if (this.selectedImages) {
    //   const alert = await this.alertController.create({
    //     header: 'save the pdf',
    //     buttons: [
    //       {
    //         text: 'No',
    //         role: 'cancel',
    //         handler: () => {
    //           this.navCtrl.back();
    //           console.log('don`t want save the pdf');

    //         }
    //       },
    //       {
    //         text: 'Yes',
    //         cssClass: 'alert-button-blue',  // Optional: Custom CSS for blue button
    //         handler: () => {
    //           console.log('I want save the pdf');
    //           // this.navCtrl.back();
    //         }
    //       }
    //     ]
    //   });
    //   await alert.present();
    // }

    this.navCtrl.back();
  }

  openCamera() {
    const CameraPreviewOptions: CameraPreviewOptions = {
      position: 'rear',
      parent: 'cameraPreview',
      className: 'cameraPreview',
    };
    CameraPreview.start(CameraPreviewOptions);
    this.cameraActive = true;
  }

  async stopCamera() {
    await CameraPreview.stop();
    this.cameraActive = false;
  }

  async clickimage() {
    const CameraPreviewPictureOptions: CameraPreviewPictureOptions = {
      quality: 90,
    };
    const result = await CameraPreview.capture(CameraPreviewPictureOptions);
    this.image = `data:image/jpeg;base64,${result.value}`;
    this.stopCamera();
  }
  flipCamera() {
    CameraPreview.flip();
  }

  async startCameraProcess() {
    this.isCameraOpen = true;
    this.toast.showToast('Processing QR code...', 'success', 'top');

    // Step 1: Scan QR code
    const qrData = await this.reportService.scanQRCode();

    // Step 2: Verify the scanned QR code
    if (qrData || this.verifyQRCode(qrData)) {
      this.toast.showToast(
        'QR code verified. Capturing image...',
        'success',
        'top'
      );

      // Step 3: Automatically capture the image without a button click
      await this.takePhoto();
    } else {
      this.toast.showToast(
        'QR code verification failed. Please try again.',
        'danger',
        'top'
      );
    }
    this.isCameraOpen = false;
  }

  verifyQRCode(qrData: any): boolean {
    // Implement QR code verification logic using reportService or other logic
    return qrData && qrData.isValid; // Example check; adjust according to actual QR data structure
  }

  async takePhoto() {
    const CameraPreviewOptions: CameraPreviewOptions = {
      position: 'rear',
      parent: 'cameraContainerId',
      className: 'cameraPreview',
      toBack: false, // Ensures the preview stays in the foreground
      height: window.innerHeight - 80, // Adjust height // Set the height dynamically based on the device
      width: window.innerWidth, // Adjust width // Set the width dynamically based on the device
      disableAudio: true, // Disable audio
    };
    // Start the camera preview
    await CameraPreview.start(CameraPreviewOptions);
    this.isCameraOpen = true; // Set the flag when the camera preview opens
    // Listen for the back button to close the camera
    const backButtonHandler = this.platform.backButton.subscribeWithPriority(
      9999,
      () => {
        if (this.isCameraOpen) {
          this.closeCamera();
        } else {
          this.goBack();
          backButtonHandler.unsubscribe(); // Remove the subscription to prevent memory leaks
        }
      }
    );

    // // Create a button dynamically for capturing the image
    // const captureButton = document.createElement('button');
    // captureButton.innerHTML = 'Capture';
    // captureButton.style.position = 'absolute';
    // captureButton.style.bottom = '20px';
    // captureButton.style.left = '50%';
    // captureButton.style.transform = 'translateX(-50%)';
    // captureButton.style.backgroundColor = '#007bff';
    // captureButton.style.color = '#fff';
    // captureButton.style.padding = '15px 20px';
    // captureButton.style.borderRadius = '50%';
    // captureButton.style.border = 'none';
    // captureButton.style.zIndex = '9999'; // Ensure it's above the camera preview
    // captureButton.style.cursor = 'pointer';
    // captureButton.style.fontSize = '16px';
    // // Add the button to the body
    // document.body.appendChild(captureButton);
    // captureButton.onclick = async () => {
    //   await this.captureImage();
    // };

    // // Append the button to the camera preview container
    // const cameraContainer = document.getElementById('cameraPreview');
    // if (cameraContainer) {
    //   cameraContainer.appendChild(captureButton);
    // }
  }
  async captureImage() {
    try {
      const pictureOptions: CameraPreviewPictureOptions = {
        quality: 90, // Quality of the captured image
      };

      // Capture the image using CameraPreview
      const result = await CameraPreview.capture(pictureOptions);

      // Save the captured image to selectedImages
      // const imageData = `data:image/jpeg;base64,${result.value}`;

      // Save the captured image as a file to get the webPath
      const base64Data = result.value;
      const fileName = `photo_${Date.now()}.jpeg`;
      const savedFile = await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Data,
      });

      // Get the webPath from the saved file
      const webPath = Capacitor.convertFileSrc(savedFile.uri);

      this.selectedImages.push(webPath);
      this.photo = webPath;

      // Stop the camera preview after capturing the image
      await this.closeCamera();
    } catch (error) {
      console.error('Error capturing image:', error);
    }
  }

  async closeCamera() {
    await CameraPreview.stop(); // Stop the camera preview
    this.isCameraOpen = false;

    // Remove the dynamically created button
    const captureButton = document.querySelector('#cameraPreview button');
    if (captureButton) {
      captureButton.remove();
    }
  }

  // async createPDF() {
  //   if (this.capturedImages.length === 0) {
  //     // Handle case where no images are captured
  //     console.error("No images captured!");
  //     return;
  //   }

  //   try {
  //     const zip = new JSZip();
  //     const imagePromises = this.capturedImages.map(async (imagePath, index) => {
  //       const response = await fetch(imagePath);
  //       const blob = await response.blob();
  //       zip.file(`page_${index + 1}.jpg`, blob, { binary: true });
  //     });

  //     await Promise.all(imagePromises);

  //     const content = await zip.generateAsync({ type: 'blob' });
  //     saveAs(content, 'scanned_document.pdf'); // Save as PDF
  //   } catch (error) {
  //     console.error('Error creating PDF:', error);
  //     // Handle the error appropriately, e.g., show an error message to the user.
  //   }
  // }

  // Function to create and save PDFs
  // async createPDF() {
  //   if (this.selectedImages.length === 0) {
  //     console.error("No images captured!");
  //     return;
  //   }

  //   const zip = new JSZip();
  //   const imagePromises = this.selectedImages.map(async (imagePath, index) => {
  //     const response = await fetch(imagePath);
  //     const blob = await response.blob();
  //     zip.file(`page_${index + 1}.jpg`, blob, { binary: true });
  //   });

  //   await Promise.all(imagePromises);

  //   const content = await zip.generateAsync({ type: 'blob' });
  //   const base64Data = await this.convertBlobToBase64(content);

  //   const fileName = `Pixeline-${String(Date.now()).slice(-6)}.pdf`;

  //   await Filesystem.writeFile({
  //     path: fileName,
  //     data: base64Data,
  //     directory: Directory.Documents
  //   });

  //   this.toast.showToast('PDF successfully saved');
  // }

  async createPDF(fileName: string) {
    if (this.selectedImages.length === 0) {
      console.error('No images captured!');
      this.toast.showToast('No images captured!', 'danger', 'top');
      return;
    }

    try {
      // Check if a file with the same name exists
      const existingFiles = await Filesystem.readdir({
        directory: Directory.Documents,
        path: '', // Add path here, '' indicates the root of the Documents directory
      });
      const fileExists = existingFiles.files.some(
        (file) => file.name === `${fileName}.pdf`
      );

      if (fileExists) {
        this.presentFileNameAlert();
        // Show a toast and stop the process if file name already exists
        this.toast.showToast(
          'Enter a unique name, file already exists!',
          'danger',
          'top'
        );
        return;
      }

      const pdfDoc = await PDFDocument.create();
      const pageWidth = 400;
      const pageHeight = 700;
      const padding = 20; // Padding for left and right

      // let numberOfPages = 0;

      for (const imagePath of this.selectedImages) {
        const response = await fetch(imagePath);
        const imageBlob = await response.blob();
        const imageBytes = await imageBlob.arrayBuffer();

        let img;
        if (imagePath.endsWith('.jpg') || imagePath.endsWith('.jpeg')) {
          img = await pdfDoc.embedJpg(imageBytes);
        } else {
          img = await pdfDoc.embedPng(imageBytes);
        }

        const imgWidth = img.width;
        const imgHeight = img.height;
        let scaledWidth = pageWidth - 2 * padding;
        let scaledHeight = (imgHeight * scaledWidth) / imgWidth;

        if (scaledHeight > pageHeight - 2 * padding) {
          scaledHeight = pageHeight - 2 * padding;
          scaledWidth = (imgWidth * pageHeight) / imgHeight;
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);
        page.drawImage(img, {
          x: (pageWidth - scaledWidth) / 2, // Center horizontally,
          y: (pageHeight - scaledHeight) / 2, // Center vertically,
          width: scaledWidth,
          height: scaledHeight,
        });

        // numberOfPages++; // Increment the page count
      }

      const pdfBytes = await pdfDoc.save();
      const pdfBase64 = this.arrayBufferToBase64(pdfBytes);
      // const fileName = `Pdf-${String(Date.now()).slice(-3)}.pdf`;

      const result = await Filesystem.writeFile({
        path: `${fileName}.pdf`,
        data: pdfBase64,
        directory: Directory.Documents,
      });

      const fileLocation = result.uri;

      // Get current date and time
      const currentDate = new Date();
      const formattedDate = `${String(currentDate.getDate()).padStart(
        2,
        '0'
      )}-${String(currentDate.getMonth() + 1).padStart(
        2,
        '0'
      )}-${currentDate.getFullYear()}`; // Format: DD-MM-YYYY
      const formattedTime = `${String(currentDate.getHours()).padStart(
        2,
        '0'
      )}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(
        currentDate.getSeconds()
      ).padStart(2, '0')}`; // Format: HH:MM:SS

      // Create JSON report metadata
      const jsonReport = {
        fileName: `${fileName}.pdf`,
        date: formattedDate, // Format: YYYY-MM-DD
        time: formattedTime, // Format: HH:MM:SS
        numberOfPages: this.selectedImages.length,
        fileLocation: Directory.Documents,
        id: String(Date.now()), // Unique ID for the report
        isFavorite: false, // or true if it's a favorite
        image: this.selectedImages[0], // Store the first image path
      };
      // Update the report service
      this.reportService.addReport(jsonReport);

      // Save to Preferences
      const existingReports = await Preferences.get({ key: 'pdf_reports' });
      const reportsArray = existingReports.value
        ? JSON.parse(existingReports.value)
        : [];
      reportsArray.push(jsonReport); // Add the new report
      await Preferences.set({
        key: 'pdf_reports',
        value: JSON.stringify(reportsArray), // Save updated array of reports
      });

      // this.router.navigate(['/home']);
      // this.router.navigate(['/home', { replaceUrl: true }]);
      // this.router.navigateByUrl('/home', { replaceUrl: true });

      // Logic to finalize camera actions
      // this.appComponent.navigateToHome();
      // Show a toast message after successful save
      // localStorage.setItem('navigatedFromCamera', 'true'); // Set navigation flag
      this.navController.navigateRoot('/home', { animated: true }); // This clears the navigation history
      this.Location.replaceState('/home'); // Clear browser history
      this.toast.showToast('PDF successfully saved and report generated');
    } catch (error) {
      this.toast.showToast('Error creating PDF!', 'danger', 'top');
      console.error('Error creating PDF:', error);
    }
  }

  // Helper function to convert ArrayBuffer to Base64
  arrayBufferToBase64(buffer: ArrayBuffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // Open the alert box to enter the file name and call createPDF
  async presentFileNameAlert() {
    if (this.selectedImages.length === 0) {
      console.error('No images captured!');
      this.toast.showToast('No images captured!', 'danger', 'top');
      return;
    }
    const alert = await this.alertController.create({
      header: 'Enter File Name',
      inputs: [
        {
          name: 'fileName',
          type: 'text',
          placeholder: 'Enter file name',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('File name input cancelled');
          },
        },
        {
          text: 'Save PDF',
          cssClass: 'alert-button-blue', // Optional: Custom CSS for blue button
          handler: (data) => {
            if (data.fileName) {
              this.createPDF(data.fileName); // Pass the entered file name to createPDF
            } else {
              this.toast.showToast(
                'File name cannot be empty',
                'danger',
                'top'
              );
            }
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

  async presentImageOptions(index: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      buttons: [
        {
          text: 'Retake',
          icon: 'camera',
          handler: () => {
            this.retakePhoto(index);
          },
        },
        {
          text: 'Delete',
          icon: 'trash',
          handler: () => {
            this.deleteImage(index);
          },
        },
      ],
    });
    await actionSheet.present();
    const backButtonHandler = this.platform.backButton.subscribeWithPriority(
      9999,
      () => {
        actionSheet.dismiss();
        backButtonHandler.unsubscribe(); // Remove the subscription to prevent memory leaks
      }
    );
  }

  retakePhoto(index: number) {
    this.selectedImages.splice(index, 1);
    this.takePhoto();
  }

  deleteImage(index: number) {
    this.selectedImages.splice(index, 1);
    const backButtonHandler = this.platform.backButton.subscribeWithPriority(
      9999,
      () => {
        this.navCtrl.back();
        backButtonHandler.unsubscribe(); // Remove the subscription to prevent memory leaks
      }
    );
  }
  // Function to save images
  async saveAsImage() {
    if (this.selectedImages.length === 0) {
      console.error('No images captured!');
      this.toast.showToast('No images captured!', 'danger', 'top');
      return;
    }
    for (let index = 0; index < this.selectedImages.length; index++) {
      const imageUrl = this.selectedImages[index];
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64Data = await this.convertBlobToBase64(blob);

      const fileName = `Pixeline-Image-${index + 1}.jpg`;

      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
      });

      this.toast.showToast('Image successfully saved');
    }
  }

  // Convert blob to base64
  async convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.readAsDataURL(blob);
    });
  }
}
