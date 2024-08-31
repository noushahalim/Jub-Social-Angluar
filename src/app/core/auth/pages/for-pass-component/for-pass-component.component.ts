import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { AuthService } from '../../auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-for-pass-component',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgOtpInputModule
  ],
  templateUrl: './for-pass-component.component.html',
  styleUrl: './for-pass-component.component.css'
})
export class ForPassComponentComponent implements OnInit{

  forgotPasswordForm: FormGroup;
  showPasswordField: boolean = false;
  emailSubmitted: boolean = false;
  btnDisable:boolean=false;
  enteredOtp:string = '';
  userId: string = '';
  email: string = '';
  backendError : string = '';
  isButtonEnabled : boolean = true;
  countdown : number = 30;
  intervalId : any;
  otpSented : boolean = false;
  otpVerified : boolean = false;

  constructor(private fb: FormBuilder, private authService:AuthService, private router:Router) {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit() {
    this.userId = this.authService.id
    this.email = this.authService.email
  }

  onOtpChange(data:any){
    this.enteredOtp=data      
  }

  onSubmit() {
    if (this.forgotPasswordForm.get('email')?.valid && !this.emailSubmitted) {

      this.btnDisable=true

      this.authService.forgotPassword(this.forgotPasswordForm.value.email).subscribe(
        (response)=>{
            this.authService.id=response.id;
            this.authService.email=response.email;
            this.userId = response.id;
            this.email=response.email;
            this.otpSented=true;
            this.showPasswordField = true;
            this.emailSubmitted = true;
            this.forgotPasswordForm.get('email')?.disable();
            this.btnDisable=false
        },
        (error:any)=>{
            this.btnDisable=false
            if(error.status==400){
                this.backendError=error.error
                setTimeout(() => {
                    this.backendError=''
                }, 3000);
            }
            else{
                console.error(error.message)
            }
        }
    )
            
    } else if (this.emailSubmitted && this.forgotPasswordForm.get('newPassword')?.valid) {

      this.authService.changePassword(this.forgotPasswordForm.value.newPassword).subscribe(
        (response)=>{
            this.authService.id='';
            this.authService.email='';
            this.otpSented=false;
            this.otpVerified=false;
            this.showPasswordField = false;
            this.emailSubmitted = false;
            this.router.navigate(['/auth/login'])
        },
        (error:any)=>{
            if(error.status==400){
                this.backendError=error.error
                setTimeout(() => {
                    this.backendError=''
                }, 3000);
            }
            else{
                console.error(error.message)
            }
        }
      )
    }
  }

  onOtpSubmit(){
    if (this.enteredOtp.length == 4) {
        const obj={id:this.userId,otp:this.enteredOtp}
        this.authService.forgotOtpVerification(obj).subscribe(
          (response)=>{
              this.otpVerified=true
          },
          (error:any)=>{
              if(error.status==400){
                  this.backendError=error.error
                  setTimeout(() => {
                      this.backendError=''
                  }, 3000);
              }
              else{
                  console.log(error)
              }
          }
      )
        
    }
  }

  resentOtp(){
    this.authService.forgotResendOtp().subscribe(
      (response)=>{
          console.log("success");
      },
      (error:any)=>{
          if(error.status==400){
              this.backendError=error.error
              setTimeout(() => {
                  this.backendError=''
              }, 3000);
          }
          else{
              console.log(error)
          }
      }
  )
  }

  handleClick() {
    if (!this.isButtonEnabled) {
      return;
    }
    
    this.resentOtp();
    
    this.isButtonEnabled = false;
    this.startCountdown();
  }

  startCountdown() {
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.isButtonEnabled = true;
        this.countdown = 30;
        clearInterval(this.intervalId);
      }
    }, 1000);
  }
}
