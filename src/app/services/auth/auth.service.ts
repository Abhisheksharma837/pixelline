import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { LoginModel } from 'src/app/model';
import { DataService } from '../data/data.service';

interface CouponResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private imageBaseUrl: string = environment.hostUrl;
  private BASE_API: string = environment.apiUrl;
  public token!: string;
  public userid!: string | number;
  public username!: string;
  public userImage!: string;


  constructor(
    private http: HttpClient,
    private router: Router,
    private data: DataService

  ) { }

  login(login: LoginModel): Observable<any> {
    return this.http.post(this.BASE_API + '/login', login).pipe(
      map((res: any) => {
        this.setUserData(res);
        this.setLoggedIn(true); // Set logged-in status to true 
        return res;
      })
    )
  }

  setLoggedIn(isLoggedIn: boolean) {
    this.data.set('isLoggedIn', isLoggedIn.toString());
  }
  // isLoggedIn(): Observable<boolean> {
  //   return this.data.get('isLoggedIn').pipe(
  //     map(status => !!status) // Return true if status is set, otherwise false
  //   );
  // }
  getLoggedIn(): Observable<boolean> {
    return this.data.get('isLoggedIn').pipe(
      map(value => value === 'true')
    );
  }


  signup(name: string, email: string, phone: string, password: string): Observable<any> {
    const body = { name, email, phone, password };
    return this.http.post(this.BASE_API + '/register', body).pipe(
      map((res: any) => {
        this.setUserData(res);
        return res;
      },
        catchError(error => {
          console.error('Signup error:', error);
          // Handle error and return an observable
          return of({ success: false, message: 'Signup failed' });
        })
      ));
  }

  setUserData(res: any) {
    // Ensure res and res.data exist before accessing their properties
    if (res && res.success && res.data) {
      this.data.set('token', res.data.token.toString());
      // this.data.set('userid', res.user.id.toString());
      this.data.set('username', res.data.name.toString());
      this.token = res.data.token;
      console.log('token', this.token);
      this.username = res.data.name;
      console.log('username', this.username);
      // Optional: If you expect an image, add a check for it
      this.userImage = res.data.image ? this.imageBaseUrl + res.data.image : '';
      this.data.set('userimage', res.data.image || '');
    } else {
      console.error('Invalid response structure:', res);
    }
  }

  getToken(): Observable<string> {
    return this.data.get('token');
  }


  resetPassword(
    email: string,
    password: string,
    confirmPassword: string
  ) {
    return this.http.post(this.BASE_API + '/change_Password', {
      email,
      password,
      confirmPassword,

    });
  }

  // verifyCoupon(couponCode: string): Observable<CouponResponse>  {
  //   const token = this.data.get('token');  // Adjust this to however your token is stored/accessed
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${token}`
  //   });
  //   return this.http.post<CouponResponse>(`${this.BASE_API}/apply-code`, { code: couponCode }, { headers }).pipe(
  //     map((res: CouponResponse) => res),
  //     catchError(error => {
  //       console.error('Coupon verification error:', error);
  //       return of({ success: false, message: 'Verification failed' });
  //     })
  //   );

  // }

  // Update verifyCoupon to ensure token is included correctly
  //  verifyCoupon(couponCode: string): Observable<CouponResponse> {
  //   const token = this.token || this.data.get('token');
  //   if (!token) {
  //     console.error('Token is missing. Ensure user is authenticated.');
  //     return of({ success: false, message: 'Authentication required' });
  //   }
  //   const headers = new HttpHeaders({ 'Authorization': `Bearer  ${token}` });
  //   return this.http.post<CouponResponse>(`${this.BASE_API}/apply-code`, { code: couponCode }, { headers }).pipe(
  //     map((res: CouponResponse) => res),
  //     catchError(error => {
  //       console.error('Coupon verification error:', error);
  //       return of({ success: false, message: 'Verification failed' });
  //     })
  //   );
  // }
  //   verifyCoupon(couponCode: string): Observable<CouponResponse> {
  //     // Assuming this.data.get('token') returns an Observable<string>
  //     return this.data.get('token').pipe(
  //         switchMap(tokenString => {
  //             if (!tokenString) {
  //                 console.error('Token is missing. Ensure user is authenticated.');
  //                 return of({ success: false, message: 'Authentication required' });
  //             }

  //             const headers = new HttpHeaders({
  //                 'Authorization': `'Bearer' + ${tokenString}`
  //             });
  //             // headers: req.headers.set('Authorization', 'Bearer' + this.auth.token),


  //             return this.http.post<CouponResponse>(`${this.BASE_API}/apply-code`, { code: couponCode }, { headers }).pipe(
  //                 map((res: CouponResponse) => res),
  //                 catchError(error => {
  //                     console.error('Coupon verification error details:', error);
  //                     return of({ success: false, message: 'Verification failed' });
  //                 })
  //             );
  //         }),
  //         catchError(() => of({ success: false, message: 'Failed to retrieve token' })) // Handle token retrieval errors
  //     );
  // }

  verifyCoupon(couponCode: string): Observable<CouponResponse> {
    // Assuming this.data.get('token') returns an Observable<string>
    return this.data.get('token').pipe(
      switchMap(tokenString => {
        if (!tokenString) {
          console.error('Token is missing. Ensure user is authenticated.');
          return of({ success: false, message: 'Authentication required' });
        }

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${tokenString}` // Adding the space after 'Bearer'
        });

        return this.http.post<CouponResponse>(`${this.BASE_API}/apply-code`, { code: couponCode }, { headers }).pipe(
          map((res: CouponResponse) => res),
          catchError(error => {
            console.error('Coupon verification error details:', error);
            return of({ success: false, message: 'Verification failed' });
          })
        );
      }),
      catchError(() => of({ success: false, message: 'Failed to retrieve token' })) // Handle token retrieval errors
    );
  }


}
