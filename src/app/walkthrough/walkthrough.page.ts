import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastIndicatorService } from '../services/toastIndicator/toast-indicator.service';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';


interface Step {
  head: string;
  p: string;
  image: string;
  id: number;
}

@Component({
  selector: 'app-walkthrough',
  templateUrl: './walkthrough.page.html',
  styleUrls: ['./walkthrough.page.scss'],
})
export class WalkthroughPage implements OnInit {
  public steps: Array<Step>;
  public currentStep: number;
  public showImage: boolean;
  private stepSubject: Subject<number>;

  constructor(
    private toastService: ToastIndicatorService,
    private authService: AuthService,  // Inject AuthService
    private router: Router              // Inject Router for navigation
  ) {
    this.steps = [
      {
        head: 'Write Smarter',
        p: 'Ai-powered technology propels your handwritten notes  into a new era of productivity',
        image: 'assets/logo/2smarter.jpeg',
        id: 0,
      },
      {
        head: 'Scan Sharper',
        p: 'Better than just taking a picture with auto-crop, color-pop technology',
        image: 'assets/logo/3scan.jpeg',
        id: 1,
      },

      {
        head: 'Erase',
        p: 'Better than just taking a picture with auto-crop, color-pop technology',
        image: 'assets/logo/4erase.jpeg',
        id: 2,
      },
      {
        head: 'Reuse Again & Again',
        p: 'Eliminate piles of wasteful, single-use paper with a single Pixeline',
        image: 'assets/logo/5reuse.jpeg',
        id: 3,
      },
    ];

    this.currentStep = 0;
    this.showImage = false;
    this.stepSubject = new Subject<number>();

  }
  ngOnInit(): void {
    // Initially show the splash screen
    this.showImage = true;
  
    // Check if the user is logged in
    this.authService.getLoggedIn().subscribe((isLoggedIn) => {
      setTimeout(() => {
        this.showImage = false; // Hide splash screen after 1 second
  
        if (isLoggedIn) {
          // If the user is logged in, navigate to 'tabs/home'
          this.router.navigate(['tabs/home']);
        } else {
          // Handle the splash screen for non-logged-in users
          this.currentStep = 1;
          this.stepSubject.next(this.currentStep);
  
          // Optional: Show the splash screen for a specific duration
          setTimeout(() => {
            this.showImage = false;
            this.currentStep = 1;
            this.stepSubject.next(this.currentStep);
          }, 3000); // Adjust timing as needed
        }
      }, 1000); // Delay before navigation
    });
  }

  nextStep() {
    if (this.currentStep < this.steps.length) {
      this.currentStep++;
      this.stepSubject.next(this.currentStep);
    }
    console.log(this.currentStep);
  }

}

