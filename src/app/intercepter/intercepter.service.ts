import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.auth.token) {
     
        return next.handle(req);
      }

    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + this.auth.token),
    });

    return next.handle(clonedRequest);
  }
}