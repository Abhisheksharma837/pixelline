import { Component, OnInit } from '@angular/core';
import { UserDetailsService } from '../services/user/user-details.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastIndicatorService } from '../services/toastIndicator/toast-indicator.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-couponcode',
  templateUrl: './couponcode.page.html',
  styleUrls: ['./couponcode.page.scss'],
})
export class CouponcodePage implements OnInit {
  couponForm: FormGroup;
  isCouponValid: boolean = false;
  isVerifying: boolean = false;
  validCouponCode: string = '12345678'; // Temporary valid coupon code
  constructor(
    private userDetailsService: UserDetailsService,
    private fb: FormBuilder,
    private toast: ToastIndicatorService,
    private router: Router, // Inject the router
    private auth: AuthService,

  ) {
    // Initialize the form
    this.couponForm = this.fb.group({
      couponCode: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{12}$/)]]
    });
  }

  ngOnInit() {
    // Subscribe to form changes to enable/disable the Verify button
    this.couponForm.get('couponCode')?.valueChanges.subscribe(value => {
      this.isVerifying = !this.couponForm.valid; // Enable button if form is valid
    });
  }
  // Function to verify the coupon code when the api hit for verfying the coupon code
  //  verifyCoupon() {
  //   const couponCode = this.couponForm.get('couponCode')?.value;
  //   if (couponCode) {
  //     this.isVerifying = true;
  //     this.userDetailsService.verifyCouponCode(couponCode).subscribe(async (res) => {
  //       this.isVerifying = false;
  //       if (res.success) {
  //         this.isCouponValid = true;
  //         await this.toast.showToast('Coupon code verified successfully','success','top');
  //       } else {
  //         this.isCouponValid = false;
  //         await this.toast.showToast(res.message || 'Invalid coupon code','danger','top');
  //       }
  //     });
  //   }
  // }

  // Function to verify code for tempeoiry 
  // verifyCoupon() {
  //   const couponCode = this.couponForm.get('couponCode')?.value;
  //   this.isVerifying = true;
  //   if (couponCode.length !== 8) {
  //     this.isVerifying = false;
  //     this.toast.showToast('coupon code should be 8 digit long only ')
  //   }


  //   if (couponCode === this.validCouponCode) {
  //     this.isVerifying = false;
  //     this.isCouponValid = true;
  //     this.toast.showToast('Coupon code verified successfully', 'success', 'top');
  //     // Navigate to home and clear the navigation stack
  //     this.router.navigateByUrl('/home', { replaceUrl: true });// Navigate to the home page
  //   } else {
  //     this.isVerifying = false;
  //     this.isCouponValid = false;
  //     this.toast.showToast('Invalid coupon code', 'danger', 'top');
  //   }
  // }

  // Method to verify coupon code by calling AuthService
  verifyCoupon() {
    this.isVerifying = true;
      this.auth.verifyCoupon(this.couponForm.value).subscribe(
        async (res) => {
          this.isVerifying = false;
            console.log(res.success);
            this.isCouponValid = true;
            await this.toast.showToast('Coupon code verified successfully', 'success', 'top');
            this.router.navigateByUrl('tabs/home', { replaceUrl: true });
          }
      );
  }

  // Function to continue if the coupon is valid
  continue() {
    if (this.isCouponValid) {
      this.router.navigate(['/home']); // Navigate to the home page
    }
  }

}
