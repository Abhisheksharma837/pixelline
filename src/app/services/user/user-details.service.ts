import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../data/data.service';
import { AuthService } from '../auth/auth.service';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { ToastIndicatorService } from '../toastIndicator/toast-indicator.service';


@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {

  private imageBaseUrl: string = environment.hostUrl;
  private BASE_API: string = environment.apiUrl;
  public token!: string;
  public userid!: string | number;
  public username!: string;
  public userImage!: string;

  constructor(
    private http: HttpClient,
    private router : Router,
    private data: DataService,
    private auth: AuthService,
    private toast: ToastIndicatorService,
  ) { }

   // Coupon code verification function
   verifyCouponCode(couponCode: string): Observable<{ success: boolean, message: string }> {
    const body = { couponCode };
    return this.http.post<{ success: boolean, message: string }>(`${this.BASE_API}/verify-coupon`, body).pipe(
      map((res: any) => {
        // this.toast.showToast('Coupon code verified succussfully','success','top');
        return { success: res.success, message: res.message };
      }),
      catchError((error) => {
        // this.toast.showToast('Coupon code verification failed','danger','top');
        console.error('Coupon verification error:', error);
        return of({ success: false, message: 'Verification failed' });
      })
    );
  }

   // Method to fetch user details
   getUserDetails(): Observable<any> {
    const userId = this.auth.userid; // Fetch the user ID from AuthService
    return this.http.get(`${this.BASE_API}/user/${userId}`).pipe(
      map((res: any) => {
        return {
          name: res.name,
          email: res.email,
          image: res.image ? `${this.imageBaseUrl}/${res.image}` : 'assets/default-user.png',
          dob: res.dob,
          gender: res.gender
        };
      }),
      catchError((error) => {
        console.error('Error fetching user details:', error);
        return of(null); // Return null if there's an error
      })
    );
  }

   // Method to update user profile
   updateUserProfile(data: any): Observable<any> {
    const userId = this.auth.userid;
    return this.http.put(`${this.BASE_API}/user/${userId}`, data).pipe(
      catchError((error) => {
        console.error('Error updating profile:', error);
        return of(null);
      })
    );
  }

}
