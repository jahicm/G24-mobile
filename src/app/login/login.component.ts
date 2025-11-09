import { Component, computed } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from '../app.component';
import { environment } from '../../environments/environment';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule, TranslateModule],   // 👈
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  currentLang = computed(() => this.appComponent.currentLang());

  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private appComponent: AppComponent) { }

  switchLanguage($event: Event) {
     const lang = ($event.target as HTMLSelectElement).value;
    if (lang === null) {
      const language = ($event.target as HTMLSelectElement).value;
      this.appComponent.switchLanguage(language);
      sessionStorage.setItem('lang', language);
    } else {
   
      this.appComponent.switchLanguage(lang);
      sessionStorage.setItem('lang', lang);
    }
  }

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/base']),
      error: () => this.errorMessage = 'Invalid username or password'
    });
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
