import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class TokenInterceptorService {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    //Get the Token after login
    const authToken = this.authService.getToken();
    // intercept 'req' parameter is Immutable, so we can't modify its content
    // but we can create a new copy of it through clone()
    // and then put our own Authorization token in request header

    const authRequest = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + authToken)
    });
    return next.handle(authRequest);
  }
}

