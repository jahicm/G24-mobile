import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../models/user';
import { RegistrationService } from '../services/registration.service';
import { SharedService } from '../services/shared.service';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first-registration',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './first-registration.component.html',
  styleUrl: './first-registration.component.css'
})
export class FirstRegistrationComponent {


  dataForm: FormGroup;
  medications: string[] = ['select-option', 'no-medication', 'insulin', 'tablets'];
  passwordStrength: number = 0;
  isPasswordMatch: boolean = true;
  passwordStrengthMessage: string = '';
  user: User = {
    userId: '',
    name: '',
    lastName: '',
    dob: new Date(),
    postCode: '',
    city: '',
    country: '',
    unit: '',
    diabetesType: '',
    medication: '',
    email: '',
    password: '',
    password_repeat: ''
  };


  constructor(private fb: FormBuilder, private registrationService: RegistrationService, private sharedService: SharedService, private router: Router,private translate: TranslateService) {
    
    this.dataForm = this.fb.group({
      email: ['', Validators.email],
      password: ['', [Validators.required]],
      password_repeat: ['', [Validators.required]],
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      dob: ['', Validators.required],
      country: ['', Validators.required],
      postCode: ['', Validators.required],
      city: ['', Validators.required],
      unit: ['', Validators.required],
      diabetesType: ['', Validators.required],
      medication: ['No medications']
    });
  }

  isValid() {
    const pw = this.dataForm.get('password')?.value;
    const pwRepeat = this.dataForm.get('password_repeat')?.value;
  
    if (pw && pwRepeat && pw !== pwRepeat) {
      this.isPasswordMatch = false;
    } else {
      this.isPasswordMatch = true;
    }
  }
  onSubmit(): void {
    if (this.dataForm.invalid) {
      return;

    }

    this.user = this.dataForm.value;
    let cachedUser = sessionStorage.getItem('cachedUser');
    if (cachedUser) {
      const parsedUser = JSON.parse(cachedUser);
      this.user.userId = parsedUser.userId;
    }
    this.registrationService.firstRegistration(this.user).subscribe({

      next: (response) => {
        alert(this.translate.instant('error.thankyou'))
        sessionStorage.removeItem("token");
        this.router.navigate(['/login']);

      },
      error: (err) => {
        console.error('Registration failed:', err);
        alert(this.translate.instant('error.something-went-wrong'));
      }
    });
  }
  checkStrength(): void {
    const password = this.dataForm.get('password')?.value || '';
    let strengthPoints = 0;

    if (password.length >= 8) strengthPoints++;
    if (/[A-Z]/.test(password)) strengthPoints++;
    if (/[a-z]/.test(password)) strengthPoints++;
    if (/[0-9]/.test(password)) strengthPoints++;
    if (/[^A-Za-z0-9]/.test(password)) strengthPoints++; // Sonderzeichen

    this.passwordStrength = (strengthPoints / 5) * 100;

    if (strengthPoints <= 2) {
      this.passwordStrengthMessage = this.translate.instant('first-registration.weak');
    } else if (strengthPoints === 3 || strengthPoints === 4) {
      this.passwordStrengthMessage = this.translate.instant('first-registration.medium');;
    } else {
      this.passwordStrengthMessage = this.translate.instant('first-registration.strong');;
    }
  }
  cancel() {
    this.router.navigate(['/login']);
  }
}
