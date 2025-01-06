import { Component, OnInit, Renderer2 } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ReportsService, Report } from 'src/app/services/reports/reports.service';
import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory, FilesystemDirectory } from '@capacitor/filesystem';
import { FileOpener } from '@ionic-native/file-opener/ngx';


interface Item {
  id: number;
  name: string;
  image: string;
}
@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  name!: string;
  email!: string;
  favouriteItems: Item[] = []; // Array for storing favourite items
  newestScanItems: Item[] = []; // Array for storing newest scans
  oldestScanItems: Item[] = [];
  displayedItems: Item[] = [];
  originalFavouriteItems: Item[] = [];
  originalNewestScanItems: Item[] = [];
  showSortMenu: boolean = false;
  showNewestScanSection: boolean = true;
  showFavouriteScanSection: boolean = true;

  favouriteReports: Report[] = [];
  newestReports: Report[] = [];
  reports: Report[] = []; // Specify the reports array type

  constructor(
    private navCtrl: NavController,
    private renderer: Renderer2,
    private reportService: ReportsService,
    private fileOpener: FileOpener
  ) { }

  async ionViewWillEnter() {
    await this.loadReports();  // Reload the reports whenever this page is entered
  }

  async ngOnInit() {
    await this.loadReports();
    this.reportService.currentReports.subscribe((reports: Report[]) => {
      // this.newestReports = reports; // Update reports whenever there's a change
      // Only update `newestReports` if it's really a newest scan (non-favourite)
      this.newestReports = reports.filter(report => !report.isFavourite);
      this.favouriteReports = reports.filter(report => report.isFavourite);
    });

    // Store a copy of the original arrays to restore later
    //  this.originalFavouriteItems = [...this.favouriteItems];
    //  this.originalNewestScanItems = [...this.newestScanItems];
    // Simulate oldest scans by reversing the newest scans
    // this.oldestScanItems = [...this.newestScanItems].reverse(); //oldest-scan mei, baad mei according data or time data dikhana hai.
    //for now we are not showing anything when oldest scan option select
  }
  closeMenuIfClickedOutside(event: any) {
    if (!event.target.closest('.sort-menu') && !event.target.closest('ion-button')) {
      this.showSortMenu = false;
    }
  }
  async loadReports() {
    const existingReports = await Preferences.get({ key: 'pdf_reports' });
    const reportsArray: Report[] = existingReports.value ? JSON.parse(existingReports.value) : [];

    const validReports: Report[] = [];

    // Loop through each report and check if the PDF file exists
    for (const report of reportsArray) {
      try {
        // Check if the PDF file exists
        await Filesystem.stat({
          path: report.fileName,
          directory: Directory.Documents,
        });
        validReports.push(report);  // If the file exists, add to valid reports
      } catch (error) {
        // If the file does not exist, do nothing (it will be excluded)
        console.log(`File not found: ${report.fileName}`);
      }

      // Filter reports based on favourite status and ensure no duplicates
      this.reportService.updateReports(validReports);
      this.favouriteReports = validReports.filter(report => report.isFavourite);
      this.newestReports = validReports.filter(report => !report.isFavourite);
    }

    // Save valid reports back to Preferences and update the reports list
    await Preferences.set({
      key: 'pdf_reports',
      value: JSON.stringify(validReports),
    });

    this.reports = validReports;  // Update the displayed reports
    this.reportService.updateReports(validReports);  // Update the BehaviorSubject in ReportsService
    this.favouriteReports = validReports.filter(
      (report) => report.isFavourite
    );
    this.newestReports = validReports.filter((report) => !report.isFavourite);
  
  }

  toggleBookmark(reportId: string, section: string) {
    if (section === 'newest') {
      const index = this.newestReports.findIndex(scan => scan.id === reportId);
      if (index > -1) {
        // Move from Newest to Favourite
        const [movedItem] = this.newestReports.splice(index, 1);
        movedItem.isFavourite = true;
        this.favouriteReports.push(movedItem);
      }
    } else if (section === 'favourite') {
      const index = this.favouriteReports.findIndex(scan => scan.id === reportId);
      if (index > -1) {
        // Move from Favourite to Newest
        const [movedItem] = this.favouriteReports.splice(index, 1);
        movedItem.isFavourite = false;
        this.newestReports.push(movedItem);
      }
    }

    // Update the reports in storage
    this.updateStoredReports();
    this.reportService.updateReports([...this.newestReports, ...this.favouriteReports]);

  }

  async updateStoredReports() {
    const allReports = [...this.favouriteReports, ...this.newestReports];
    await Preferences.set({ key: 'pdf_reports', value: JSON.stringify(allReports) });
  }

  // Function to open the PDF file when clicking on the card
  async openPdf(pdfName: string) {
    try {
      const uriResult = await Filesystem.getUri({
        path: pdfName,
        directory: Directory.Documents,
      });

      const filePath = uriResult.uri;

      // Open the file using FileOpener plugin
      this.fileOpener.open(filePath, 'application/pdf')
        .then(() => console.log('File opened successfully'))
        .catch(e => console.log('Error opening file', e));
    } catch (e) {
      console.log('Error getting file URI', e);
    }
  }


  goBack() {
    this.navCtrl.back();
  }
  toggleMenu() {
    this.showSortMenu = !this.showSortMenu; // Toggle the display of the menu
  }
  sortBy(option: string) {
    // Reset the arrays before sorting
    this.newestReports = [...this.reports.filter(report => !report.isFavourite)];
    this.favouriteReports = [...this.reports.filter(report => report.isFavourite)];
  
    if (option === 'newest') {
      this.showNewestScanSection = true;
      this.showFavouriteScanSection = false;
      // Filter newest reports to show only those created in the last 4 days
      // const today = new Date();
      // this.newestReports = this.newestReports.filter(scan => {
      //   const scanDate = new Date(scan.date);
      //   const timeDiff = Math.abs(today.getTime() - scanDate.getTime());
      //   const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
      //   return diffDays <= 4;
      // });
      this.showSortMenu = false;
    } 
    else if (option === 'oldest') {
      this.showNewestScanSection = true;
      this.showFavouriteScanSection = true;
      // Filter oldest reports for both newest and favourite
      const today = new Date();
      this.newestReports = this.newestReports.filter(scan => {
        const scanDate = new Date(scan.date);
        const timeDiff = Math.abs(today.getTime() - scanDate.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays <= 360;
      });
      this.favouriteReports = this.favouriteReports.filter(scan => {
        const scanDate = new Date(scan.date);
        const timeDiff = Math.abs(today.getTime() - scanDate.getTime());
        const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return diffDays <= 360; // Only show bookmarked PDFs created before 4 days
      });
      this.showSortMenu = false;
    } 
    else if (option === 'name') {
      this.showNewestScanSection = true;
      this.showFavouriteScanSection = true;
      // Sort by name across both sections
      const customSort = (a: Report, b: Report) => a.fileName.localeCompare(b.fileName);
      this.newestReports = this.newestReports.sort(customSort);
      this.favouriteReports = this.favouriteReports.sort(customSort);
      this.showSortMenu = false;
    } 
    else if (option === 'favourite') {
      this.showNewestScanSection = false;
      this.showFavouriteScanSection = true;
      // Show only favourite reports
      this.showSortMenu = false;
    }
  }
  
}
