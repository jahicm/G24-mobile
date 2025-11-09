import { Component,Pipe } from '@angular/core';
import { AppComponent } from '../app.component';
import { TranslateService,TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-g24',
  imports: [TranslateModule],
  templateUrl: './g24.component.html',
  styleUrl: './g24.component.css'
})
export class G24Component {

  showHeaderFooter = false;
  constructor(private appComponent: AppComponent,private translateService:TranslateService) { }

  ngOnInit(): void {
    const lang = sessionStorage.getItem('lang');
    if (lang != null)
      this.appComponent.switchLanguage(lang);
    else {
      this.appComponent.switchLanguage('en');
      sessionStorage.setItem('lang', 'en');
    }

  }
  switchLanguage(event: Event) {
    const lang = (event.target as HTMLSelectElement).value;
    if (lang === null) {
      const language = (event.target as HTMLSelectElement).value;
      this.appComponent.switchLanguage(language);
      sessionStorage.setItem('lang', language);
    } else {
      this.appComponent.switchLanguage(lang);
      sessionStorage.setItem('lang', lang);
    }
  }

}
