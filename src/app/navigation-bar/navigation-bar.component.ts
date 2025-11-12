import { Component, computed, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-navigation-bar',
  imports: [TranslateModule],
  templateUrl: './navigation-bar.component.html',
  styleUrl: './navigation-bar.component.css'
})
export class NavigationBarComponent implements OnInit {


  currentLang = computed(() => this.appComponent.currentLang());

  constructor(private authService: AuthService, private router: Router, private appComponent: AppComponent) { }

  ngOnInit(): void {
    const lang = localStorage.getItem('lang');
    if(lang != null)
      this.appComponent.switchLanguage(lang);
    else
    {
      this.appComponent.switchLanguage('en');
      localStorage.setItem('lang', 'en');
    }

  }
  switchLanguage(event: Event) {
    const lang = (event.target as HTMLSelectElement).value;
    if (lang === null) {
      const language = (event.target as HTMLSelectElement).value;
      this.appComponent.switchLanguage(language);
      localStorage.setItem('lang', language);
    } else {
      this.appComponent.switchLanguage(lang);
      localStorage.setItem('lang', lang);
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('lang');
    this.router.navigate(['/login']);
  }
}
