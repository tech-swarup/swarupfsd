import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [DatePipe]
})


export class LoginComponent implements OnInit {

  userIsValid = false;
  isLoading = false;
  msg!: String;
  form!: NgForm

  now: any = Date.now();
  format: string = "medium";

  constructor(private authService: AuthService, private datePipe: DatePipe) { }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    // console.log(form.value);
    this.isLoading = true;
    this.authService.login(form.value.email, form.value.password);
    form.resetForm();
  }

  ngOnInit(): void {
    this.authService.getUserNotValidListener()
    .subscribe(isPost => {
      this.userIsValid = true;
      this.msg = "User Login Failed";
      //this.form.resetForm();
      this.isLoading = false;
    });
  }

  get dateInGMT(): any {
    return this.datePipe.transform(this.now, this.format, "GMT");
  }
}
