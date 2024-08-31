import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Router } from "@angular/router";
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private route: Router) {}
  
  registerForm!: FormGroup;
  backendError:string = ''

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/
          ),
        ],
      ],
    });
  }

  onSubmit() {
    if(this.registerForm.valid){
      this.authService.clientSignup(this.registerForm.value).subscribe(
        (response)=>{
            this.authService.id=response.clientId
            this.authService.email=response.email
            this.route.navigate(['/auth/otp'])
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
}
