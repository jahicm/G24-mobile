import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { EmailService } from '../services/email.service';

@Component({
  selector: 'app-forget',
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './forget.component.html',
  styleUrl: './forget.component.css'
})
export class ForgetComponent {

  dataForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private emailService: EmailService,private translate:TranslateService) {
    this.dataForm = this.fb.group({
      email: ['', Validators.email]
    });
  }
  onSubmit(): void {
    if (this.dataForm.invalid) {
      return;
    }

    const email = this.dataForm.value.email;
    this.emailService.sendPasswordResetEmail(email).subscribe({
      next: (response) => {
        alert(this.translate.instant('reset-email.password-sent')+" "+ email);
      },
      error: (err) => {
        console.error('❌ Failed to send password reset email:', err);
        alert(this.translate.instant('reset-email.error-sending')+" "+email);
      }
    });

    this.router.navigate(['/login']);
  }
  cancel() {
    this.router.navigate(['/login']);
  }

}
