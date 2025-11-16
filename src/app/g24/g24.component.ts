import { Component, Pipe } from '@angular/core';
import { AppComponent } from '../app.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-g24',
  imports: [TranslateModule],
  templateUrl: './g24.component.html',
  styleUrl: './g24.component.css'
})
export class G24Component {

  showHeaderFooter = false;
  constructor(private appComponent: AppComponent, private translateService: TranslateService, private router: Router) { }

  ngOnInit(): void {
    const lang = localStorage.getItem('lang');
    const token = localStorage.getItem('token');

    if (lang != null) {
      this.appComponent.switchLanguage(lang);

    } else {
      this.appComponent.switchLanguage('en');
      localStorage.setItem('lang', 'en');
    }
    
    if (token) {
      this.router.navigate(['/base']);
    } else {
      this.router.navigate(['/login']);
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

}
