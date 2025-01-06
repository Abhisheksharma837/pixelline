import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  Platform,
  AlertController,
} from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/data/data.service';
import { ToastIndicatorService } from '../../services/toastIndicator/toast-indicator.service';
import { ReportsService } from '../../services/reports/reports.service';
import { Report } from '../../services/reports/reports.service';
import { BarcodeScanner, SupportedFormat } from '@capacitor-community/barcode-scanner';
import { Location } from '@angular/common'; // Import Location service
import jsQR from "jsqr";
interface Item {
  id: number;
  name: string;
  image: string;
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  @Output() menuStatus: EventEmitter<boolean> = new EventEmitter();
  videoStream: any;
  hamburger!: boolean;
  userImage: string = 'assets/logo/2smarter.jpeg';
  favouriteReports: Report[] = [];
  newestReports: Report[] = [];
  searchTerm: string = '';
  isSearching: boolean = false
  originalFavouriteReports: Report[] = [];
  originalNewestReports: Report[] = [];
  steps = [
    { title: 'Step 1', videoSrc: 'assets/videos/sample1.mp4' },
    { title: 'Step 2', videoSrc: 'assets/videos/sample1.mp4' },
    { title: 'Step 3', videoSrc: 'assets/videos/sample1.mp4' },
    { title: 'Step 3', videoSrc: 'assets/videos/sample1.mp4' },
    { title: 'Step 3', videoSrc: 'assets/videos/sample1.mp4' }
  ];
  scannedPages: Array<{
    qrCode: string;
    image: string;
    extractedText: string;
    pageSize: string;
  }> | any = [];
  isScanning = false;
  scanCount: number = 0;
  currentScannedPage: { qrCode: string; image: string; extractedText: string; pageSize: string; pdfImage: string } | null = null;
  content_visibility: string = 'visible';
  getScan: boolean = false;
  constructor(
    private data: DataService,
    private router: Router,
    protected auth: AuthService,
    private alertCtrl: AlertController,
    private toast: ToastIndicatorService,
    private platform: Platform,
    private reportService: ReportsService,
    private location: Location,
    private cdr: ChangeDetectorRef
  ) { }
  ngOnInit() {
    // Load data from localStorage immediately after the component initializes
    this.getDataStorage();
    this.reportService.contentVisibility$.subscribe((value) => {
      this.content_visibility = value; // Update component visibility
    });
    this.scannedPages = this.getScannedPagesFromLocalStorage();
    console.log("Loaded scanned pages:", this.scannedPages);
  }

  // ngAfterViewInit() {
  //   this.cdr.detectChanges();
  // }

  // Fetch 'scanner' value from localStorage and update getScan state
  getDataStorage() {
    const getdata = localStorage.getItem('scanner');
    if (getdata) {
      this.getScan = JSON.parse(getdata);  // Set getScan to the value stored in localStorage
      console.log("getscan in ngOnInit:", this.getScan);  // Ensure change detection is triggered immediately
    } else {
      console.log("No 'scanner' value in localStorage");
    }
  }
  toggleSearch() {
    this.isSearching = !this.isSearching;
    if (!this.isSearching) this.clearSearch();
  }
  // Filters reports based on the search term
  searchReports() {
    if (!this.searchTerm) {
      this.restoreReports();
      return;
    }
    this.reportService.currentReports.subscribe((reports: Report[]) => {
      this.newestReports = reports.filter((report) => !report.isFavourite);
      this.favouriteReports = reports.filter((report) => report.isFavourite);
    });
    this.favouriteReports = this.originalFavouriteReports.filter((report) =>
      report.fileName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.newestReports = this.originalNewestReports.filter((report) =>
      report.fileName.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Restores the original reports and clears the search term
  clearSearch() {
    this.searchTerm = '';
    this.isSearching = false;
    this.restoreReports();
  }

  // Restores original favourite and newest reports
  restoreReports() {
    this.reportService.currentReports.subscribe((reports: Report[]) => {
      // this.newestReports = reports; // Update reports whenever there's a change
      // Only update `newestReports` if it's really a newest scan (non-favourite)
      this.newestReports = reports.filter((report) => !report.isFavourite);
      this.favouriteReports = reports.filter((report) => report.isFavourite);
    });
  }

  goBack() {
    this.location.back(); // Navigate back to the previous page
  }

  async logOut() {
    const alertBox = await this.alertCtrl.create({
      header: 'Confirm Logout?',
      message: 'Are you sure you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Logout',
          handler: () => {
            this.data.remove('token');
            this.data.remove('userid');
            this.data.remove('userimage');
            this.data.remove('isLoggedIn'); // Clear login status

            this.auth.token = '';
            this.auth.userid = '';
            this.auth.userImage = '';
            this.auth.username = '';
            this.router.navigate(['/login']);
            this.toast.showToast('Logout Successfully');
            this.hamburger = false;
          },
        },
      ],
    });
    await alertBox.present();
    const backButtonHandler = this.platform.backButton.subscribeWithPriority(
      9999,
      () => {
        alertBox.dismiss();
        backButtonHandler.unsubscribe(); // Remove the subscription to prevent memory leaks
      }
    );
  }
  async checkPermission(): Promise<boolean | any> {
    try {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        return true;
      }
      return false;
    } catch (e) {
      console.log(e);
    }
  }
  async scanBarcode(onPageScanned?: (page: any) => void) {
    try {
      const permission = await this.checkPermission();
      if (!permission) {
        return;
      }
      this.isScanning = true;
      this.getScan = true;
      localStorage.setItem('scanner', JSON.stringify(this.isScanning));
      console.log('getscan:', this.getScan);
      this.getDataStorage();
      const video = document.createElement('video');
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      this.videoStream = stream;
      video.srcObject = stream;
      video.setAttribute('playsinline', 'true'); // Required for iOS devices
      await video.play();

    // Begin processing frames
    this.scanFrame(video);
      const scannerScreen = document.querySelector('#scanner-screen') as HTMLElement;
      if (scannerScreen) {
        scannerScreen.style.display = 'block';
      }
      BarcodeScanner.hideBackground();
      this.reportService.setContentVisibility('hidden');
      while (this.isScanning) {
        try {
          const qrCode = await BarcodeScanner.startScan({
            cameraDirection: 'back',
            targetedFormats: [SupportedFormat.QR_CODE],
        });
          if (qrCode && qrCode.content) {
            const image = await this.capturePageImage();
            const alignedImage = await this.alignImage(image);
            const extractedText = await this.extractTextFromImage(alignedImage);
            const pageSize = 'A4';
            const page = {
              qrCode: qrCode.content,
              image: alignedImage,
              extractedText,
              pageSize,
            };
            this.scanCount++;
            this.scannedPages.push(page);
            this.saveToLocalStorage(page);
            if (onPageScanned) {
              onPageScanned(page);
            }
            console.log(`Scanned QR Code: ${qrCode.content}`);
            this.updateScannerUI();
          }
        } catch (scanError) {
          console.error('Scan error:', scanError);
        }
      }
    } catch (e) {
      console.error('Error during scanning:', e);
      this.stopScan();
    }
  }
  updateScannerUI() {
    if (this.getScan && this.scannedPages.length > 0) {
      this.cdr.detectChanges(); // Ensure the UI updates
    }
  }
  scanFrame(video: HTMLVideoElement) {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('CanvasRenderingContext2D is not available');
      return;
    }
    canvas.width = video.videoWidth || 900;
    canvas.height = video.videoHeight || 950;
    const processFrame = () => {
      if (!this.getScan) {
        this.stopScan();
        return;
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, imageData.width, imageData.height);
  
      if (qrCode) {
        this.showFocusBox(
          qrCode.location.topLeftCorner.x,
          qrCode.location.topLeftCorner.y,
          qrCode.location.bottomRightCorner.x - qrCode.location.topLeftCorner.x,
          qrCode.location.bottomRightCorner.y - qrCode.location.topLeftCorner.y
        );
        console.log('QR Code Data:', qrCode.data);
        this.scannedPages.push({
          image: canvas.toDataURL(),
          qrData: qrCode.data,
        });
        this.getScan = false;
        this.updateScannerUI();
      } else {
        const detectedPage = this.detectPage(ctx, canvas.width, canvas.height);
        if (detectedPage) {
          this.showFocusBox(
            detectedPage.x,
            detectedPage.y,
            detectedPage.width,
            detectedPage.height
          );
        }
      }
  
      requestAnimationFrame(processFrame);
    };
    processFrame();
  }
  
  
  
  handleScannerClick(event: MouseEvent) {
    const tapX = event.clientX;
    const tapY = event.clientY;
    const boxWidth = 100;
    const boxHeight = 100;
    this.showFocusBox(tapX, tapY, boxWidth, boxHeight);
  }
  showFocusBox(x: number, y: number, width: number, height: number) {
    const box = document.createElement('div');
    box.style.position = 'absolute';
    box.style.left = `${x}px`;
    box.style.top = `${y}px`;
    box.style.width = `${width}px`;
    box.style.height = `${height}px`;
    box.style.border = '2px solid green';
    box.style.pointerEvents = 'none';
    box.style.zIndex = '1000';
    document.body.appendChild(box);
    setTimeout(() => {
      document.body.removeChild(box);
    }, 1000);
  }
  detectPage(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const detectedBoundary = {
      x: 50,
      y: 50,
      width: width - 100,
      height: height - 100,
    };
    if (
      detectedBoundary.x >= 0 &&
      detectedBoundary.y >= 0 &&
      detectedBoundary.width <= width &&
      detectedBoundary.height <= height
    ) {
      return detectedBoundary;
    }
  
    return null;
  }
  
  stopScan() {
    this.isScanning = false;
    this.getScan = false;
    localStorage.setItem('scanner', JSON.stringify(this.getScan));
    console.log('getscan (after stop):', this.getScan);
    this.cdr.detectChanges();
    this.reportService.setContentVisibility('visible');
    BarcodeScanner.showBackground();
    this.getDataStorage();
  }
 
async capturePageImage(): Promise<string> {
  const videoElement = document.getElementById('video') as HTMLVideoElement;
  if (!videoElement) {
      throw new Error('Video element not found');
  }
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;

  const context = canvas.getContext('2d')!;
  context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg');
}

  async detectAndCropPage(image: string): Promise<string> {
    const img = new Image();
    img.src = image;
    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const pageWidth = img.width * 0.8;
        const pageHeight = img.height * 0.8;
        const pageX = (img.width - pageWidth) / 2;
        const pageY = (img.height - pageHeight) / 2;
        canvas.width = pageWidth;
        canvas.height = pageHeight;
        ctx.drawImage(img, pageX, pageY, pageWidth, pageHeight, 0, 0, pageWidth, pageHeight);
        resolve(canvas.toDataURL('image/jpeg'));
      };
    });
  }
  async alignImage(image: string): Promise<string> {
    const img = new Image();
    img.src = image;
    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        resolve(canvas.toDataURL('image/jpeg'));
      };
    });
  }

  async extractTextFromImage(image: string): Promise<string> {
    return 'Extracted text goes here';
  }
  saveToLocalStorage(page: {
    qrCode: string;
    image: string;
    extractedText: string;
    pageSize: string;
  }) {
    const storedPages = JSON.parse(localStorage.getItem('scannedPages') || '[]');
    storedPages.push(page);
    localStorage.setItem('scannedPages', JSON.stringify(storedPages));
  }


  getScannedPagesFromLocalStorage(): Array<{
    qrCode: string;
    image: string;
    extractedText: string;
    pageSize: string;
    pdfImage: string;
  }> {
    return JSON.parse(localStorage.getItem('scannedPages') || '[]');
  }
  ngOnDestroy() {
    this.stopScan();
}
}
