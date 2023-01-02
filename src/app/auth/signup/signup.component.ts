import { Component, OnChanges, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnChanges {
  userIsCreated = false;
  isLoading = false;
  msg!: String;
  form!: NgForm

  constructor(private authService: AuthService, private router: Router) { }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    console.log(form.value);
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password);
    this.form = form;
  }

  ngOnInit(): void {
    this.authService.getUserCreateListener()
      .subscribe(isPost => {
        this.userIsCreated = true;
        this.msg = "User Created Successfully";
        //this.form.resetForm();
        this.isLoading = false;
      });

      this.authService.getUserNotCreateListener()
      .subscribe(isPost => {
        this.userIsCreated = true;
        this.msg = "User Already Exist";
        //this.form.resetForm();
        this.isLoading = false;
      });
  }

  ngOnChanges(){
    console.log("Content of Component changes");
  }

}
