import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

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
    private router : Router

  ) { }

  signup(name: string, emailOrPhone: string, password: string): Observable<any> {
    const body = { name, emailOrPhone, password };
    return this.http.post(this.BASE_API + '/signup', body).pipe(
      catchError(error => {
        console.error('Signup error:', error);
        // Handle error and return an observable
        return of({ success: false, message: 'Signup failed' });
      })
    );
  }
}
