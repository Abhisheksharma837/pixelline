import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';


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

  constructor() {
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
    //Initially splash Screen
    setTimeout(() => {
      this.showImage = true;
    }, 0); 

    //after 3 second
    setTimeout(() => {
      this.showImage = false;  // Hide splash screen
      this.currentStep = 1;
      this.stepSubject.next(this.currentStep);
    }, 3000); // Adjust the timing as needed

    // Subscribe to the stepSubject to manage step changes
    this.stepSubject.subscribe((step) => {
      if (step <= this.steps.length) {
        this.currentStep = step;
      }
    });
  console.log(this.currentStep);
  
  }
  

  nextStep() {
    if (this.currentStep < this.steps.length ) {
      this.stepSubject.next(this.currentStep + 1);
    }
    console.log(this.currentStep);
    
  }

}

