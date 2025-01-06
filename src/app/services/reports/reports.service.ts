import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';
import { CapacitorBarcodeScanner } from '@capacitor/barcode-scanner';
import { ToastIndicatorService } from '../toastIndicator/toast-indicator.service';

export interface Report {
  fileName: string;
  date: string;
  time: string;
  numberOfPages: number;
  fileLocation: string;
  id: string;
  isFavourite: boolean;
  image: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private allowBackNavigation = false;
  private scanningSubject = new BehaviorSubject<boolean>(false);
  isScanning$ = this.scanningSubject.asObservable();
  private reportsSource = new BehaviorSubject<any[]>([]);
  currentReports = this.reportsSource.asObservable();
  private menuStatus = new BehaviorSubject<boolean>(false);
  menuStatus$ = this.menuStatus.asObservable();
  private contentVisibilitySubject = new BehaviorSubject<string>(this.getContentVisibility());
  contentVisibility$ = this.contentVisibilitySubject.asObservable();
  constructor(private toast: ToastIndicatorService) {
    this.loadReportsFromPreferences();
  }
  setContentVisibility(value: string) {
    this.contentVisibilitySubject.next(value);
    localStorage.setItem('SCANRESULT', JSON.stringify(value));
  }

  getContentVisibility() {
    const storedValue = localStorage.getItem('SCANRESULT');
    return storedValue ? JSON.parse(storedValue) : 'visible';
  }
  setScanningState(isScanning: boolean) {
    this.scanningSubject.next(isScanning);
  }
  setMenuStatus(isOpen: boolean) {
    this.menuStatus.next(isOpen);
  }
  // Method to load reports from Preferences on app startup
  async loadReportsFromPreferences() {
    const existingReports = await Preferences.get({ key: 'pdf_reports' });
    const reportsArray: Report[] = existingReports.value
      ? JSON.parse(existingReports.value)
      : [];
    this.reportsSource.next(reportsArray); // Update the BehaviorSubject with loaded reports
  }

  setAllowBackNavigation(allowed: boolean) {
    this.allowBackNavigation = allowed;
  }

  canNavigateBack(): boolean {
    return this.allowBackNavigation;
  }
  updateReports(reports: any[]) {
    this.reportsSource.next(reports);
  }

  async addReport(report: any) {
    // const currentReports = this.reportsSource.getValue();
    // currentReports.unshift(report); // Add the new report at the beginning
    // this.updateReports(currentReports);

    const existingReports = await Preferences.get({ key: 'pdf_reports' });
    const reportsArray: Report[] = existingReports.value
      ? JSON.parse(existingReports.value)
      : [];

    // Add new report and save back to Preferences
    reportsArray.unshift(report);
    await Preferences.set({
      key: 'pdf_reports',
      value: JSON.stringify(reportsArray),
    });

    // Update the BehaviorSubject
    this.reportsSource.next(reportsArray);
  }

  async deleteReport(reportId: string) {
    const existingReports = await Preferences.get({ key: 'pdf_reports' });
    const reportsArray: Report[] = existingReports.value
      ? JSON.parse(existingReports.value)
      : [];

    // Filter out the deleted report and update the Preferences
    const updatedReports = reportsArray.filter(
      (report) => report.id !== reportId
    );
    await Preferences.set({
      key: 'pdf_reports',
      value: JSON.stringify(updatedReports),
    });

    // Update the BehaviorSubject
    this.reportsSource.next(updatedReports);
  }

  async scanQRCode(val?: number) {
    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: val || 17,
        cameraDirection: 1,
      });
  
      if (!result || !result.ScanResult) {
        throw new Error('No QR code found.');
      }
  
      console.log('Scanned QR Code:', result.ScanResult);
      return result.ScanResult;
    } catch (error) {
      console.error('Error during QR scanning:', error);
      throw error; // Ensure proper handling where this is called
    }
  }
  
}
