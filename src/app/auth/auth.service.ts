import { AuthData } from './auth-data';
import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";

import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token!: string;
  private tokenTimer: any;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private userCreateListener = new Subject<boolean>();
  private userNotCreateListener = new Subject<boolean>();
  private userNotValidListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) { }

  getUserCreateListener() {
    return this.userCreateListener.asObservable();
  }

  getUserNotCreateListener() {
    return this.userNotCreateListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post<{ error: String }>("https://swarupnode.up.railway.app/api/signup", authData)
    // this.http.post<{ error: String }>("https://studnodefile.herokuapp.com/api/signup", authData)
    // this.http.post<{ error: String }>("https://proswarup.herokuapp.com/api/signup", authData)
    //this.http.post<{ error: String, token: string; expiresIn: number }>("http://localhost:3000/api/signup", authData)
      .subscribe(response => {
        console.log(response.error);
        if (response.error == "User exist") {
          console.log('user is there');
          this.userNotCreateListener.next(true);
        } else {
          this.userCreateListener.next(true);
        }

      });
  }

  getToken() {
    return this.token;
  }

  //This function will be called display-user component
  // to check if user is not Authenticated then Edit/Delete
  // will  not be shown
  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserNotValidListener() {
    return this.userNotValidListener.asObservable();
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };

    //this.http.post<{ error: String, token: string; expiresIn: number }>("https://studnodefile.herokuapp.com/api/login", authData)
    // this.http.post<{ error: String, token: string; expiresIn: number }>("https://proswarup.herokuapp.com/api/login", authData)
    //this.http.post<{ error: String, token: string; expiresIn: number }>("http://localhost:3000/api/login", authData)
    this.http.post<{ error: String, token: string; expiresIn: number }>("https://swarupnode.up.railway.app/api/login", authData)
      .subscribe(response => {
        console.log(response);
        console.log(response.error);

        if((response.error == "Not a valid password") ||  (response.error == "User Not Found") ){
          this.userNotValidListener.next(true);
        } else {
          this.token = response.token;
          if (response.token) {
            const expiresInDuration = response.expiresIn;
            console.log(expiresInDuration)
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.authStatusListener.next(true);

            // Create Date
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);      // To convert Millisecond to Second
            console.log(expirationDate)

            // Save the Token in the Local storage
            this.saveAuthData(this.token, expirationDate)

            this.router.navigate(['/']);
          }
        }
      });
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  logout() {
    this.token != null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    // Clear Localstorage Token
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  // Storing data inside local storage
  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    // We cannot store date in localStorage, so we have typecast to Date String format
  }


  // Clear data from Local storage as Logout
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }

  // Fetching the token from localStorage
  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    }
  }

  // This method is called from app.component when the application loads be default
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (authInformation) {
      const now = new Date();
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
      // Getting it in Millisecond
      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.setAuthTimer(expiresIn / 1000);   // setAuthTimer() works in second so convert to millisecond
        this.authStatusListener.next(true);
      }
    }
  }
}
