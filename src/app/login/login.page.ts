import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from '../services/auth/auth.service';
import { ToastIndicatorService } from '../services/toastIndicator/toast-indicator.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public loginForm!: FormGroup;
  public error: string | boolean = false;
  public isShow: boolean = true;
  public passwordsStrenth: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private toast: ToastIndicatorService
  ) { 

  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl('abhishek.sharma74792@gmail.com', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('Abhi@123', [
        Validators.required,
        Validators.minLength(8)
      ])
    });
  }
  async onLogin() {
    if (this.loginForm.invalid) {
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Logging in...',
    });
    await loading.present();

    this.authService.login(this.loginForm.value).subscribe({
      next: async (res) => {
        this.error = false;
        await loading.dismiss();
        localStorage.setItem('token',res.data.token);
        localStorage.setItem('UserData',JSON.stringify(res.data));
        this.router.navigate(['tabs/home']);
        this.toast.showToast('Login Succesfully','success','top');

      },
      error: async (err) => {
        this.toast.showToast('Invalid login details','danger','top')
        await loading.dismiss();

        // this.error = err.error.message || 'Login failed';
      }
    });
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

  

}
