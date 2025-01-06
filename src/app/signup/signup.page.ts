import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ToastIndicatorService } from '../services/toastIndicator/toast-indicator.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public signupForm: FormGroup;
  public passwordsStrenth: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private toast: ToastIndicatorService,  
    private loadingController: LoadingController,
    private router: Router // <-- inject the Router service

  )
  {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['',[Validators.required, Validators.email]],
      phone:['',[Validators.required,Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
  }
  
  //Checking password Strength
  evaluatePasswordStrength(password:string | null){
    if(!password || password.length === 0){
      this.passwordsStrenth = ''; // No password entered
      // this.toast.showToast('Please enter the password','danger','top')
    }else if(password.length < 8){
      this.passwordsStrenth = '';
    } else if(password.length >=8 && /[A-Z]/.test(password) && /\d/.test(password)){
      this.passwordsStrenth = 'Medium';
    } else if (password.length >=8 && /[A-Z]/.test(password) &&  /\d/.test(password) && /[!@#$%^&*]/.test(password)){
      this.passwordsStrenth = 'Strong';
    }else {
      this.passwordsStrenth = 'Weak';
    }
  }

  async onSignup() {
    if (this.signupForm.valid) {
      const { name, email, phone, password } = this.signupForm.value;

      //Display loader during signup
      const loading = await this.loadingController.create({
        message: 'Signing up...',
      });
      await loading.present();

      this.authService.signup(name, email , phone, password)
      .pipe(
        tap(() => console.log('Attempting signup...')),
        switchMap(response => {
          this.router.navigate(['/couponcode']);
          return of(response);  // or another observable
        })
      )
      .subscribe(
        async response => {
          console.log('Signup successful', response);
          this.toast.showToast('Signup Successful', 'success', 'top');  // Success toast
          // this.signupForm.reset();  // Reset the form after signup
          await loading.dismiss();
        },
        async error => {
          console.error('Signup failed', error);
          this.toast.showToast('Email already exits', 'danger', 'top');  // Failure toast
          await loading.dismiss();
        }
      );
    } else {
      //if the form is invalid 
      this.toast.showToast('Please fix errors in the form', 'danger','top');
    }
  }
}
