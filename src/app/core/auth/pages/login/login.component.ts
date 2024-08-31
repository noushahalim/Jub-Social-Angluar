import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';
import { Router } from "@angular/router";
import { environment } from '../../../../../environment/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private authService:AuthService, private route:Router) {}

  loginForm!: FormGroup;
  backendError:string=''

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        (response)=>{
          const api = environment.baseUrl
          localStorage.setItem('token', response.token);
          localStorage.setItem('fullName', response.fullName);
          localStorage.setItem('profile', `${api}${response.profileImage}`);
          this.authService.token = response.token;
          this.authService.fullName = response.fullName;
          this.authService.profile = `${api}${response.profileImage}`;
          this.route.navigate(['/']);
        },
        (error:any)=>{
          if (error.status == 400) {
          this.backendError = error.error;
          setTimeout(() => {
            this.backendError = '';
          }, 3000);
        } else {
          console.log(error);
        }
        }
      )
    }
  }
}
