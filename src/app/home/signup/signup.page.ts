import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  public signupForm: FormGroup;

  constructor(private fb: FormBuilder) {
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

    }
  }
}
