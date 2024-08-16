import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService
  )
  {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      emailOrPhone: ['', [Validators.required, this.emailOrPhoneValidator()]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
  }
  emailOrPhoneValidator() {
    return (control: AbstractControl) => {
      const value = control.value;
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const phonePattern = /^[0-9]{10}$/;

      if (emailPattern.test(value) || phonePattern.test(value)) {
        return null;
      } else {
        return { invalidEmailOrPhone: true };
      }
    };
  }
  
  onSignup() {
    if (this.signupForm.valid) {
      const { name, emailOrPhone, password } = this.signupForm.value;
      this.authService.signup(name, emailOrPhone, password)
      .pipe(
        tap(() => console.log('Attempting signup...')),
        switchMap(response => {
          // additional logic here, e.g., navigate after signup
          
          return of(response);  // or another observable
        })
      )
      .subscribe(
        response => console.log('Signup successful', response),
        error => console.error('Signup failed', error)
      );
    }
  }
}
