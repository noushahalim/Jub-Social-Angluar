import { Component, OnInit, Output } from '@angular/core';
import { NgOtpInputModule } from  'ng-otp-input';
import { AuthService } from '../../auth.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [NgOtpInputModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.css'
})
export class OtpComponent  implements OnInit{

  constructor (private authService: AuthService, private router:Router){}
  
    enteredOtp! : string
    userId : string=''
    email: string = ''
    isButtonEnabled : boolean = true
    countdown : number = 30
    intervalId : any
    backendError : string = ''

  ngOnInit() {
    this.userId = this.authService.id
    this.email = this.authService.email
  }

  onOtpChange(data:any){
    this.enteredOtp=data      
  }

  onSubmit(){
    if (this.enteredOtp.length == 4) {
        const obj={id:this.userId,otp:this.enteredOtp}
        this.authService.signupOtpVerification(obj).subscribe(
          (response)=>{
              this.authService.id=''
              this.authService.email=''
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
                  console.log(error)
              }
          }
      )
        
    }
  }

  resentOtp(){
    this.authService.signupResendOtp().subscribe(
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
