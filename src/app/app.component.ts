import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { FooterComponent } from "./footer/footer.component";
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavigationBarComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'G24';
  showHeaderFooter = true;
  showHeader = false;
  currentLang = signal<string>('en');

  constructor(private translateService: TranslateService, private router: Router) {
    translateService.setDefaultLang(this.currentLang());
    
    const hideHeaderFooterRoutes = [
      '/',                // Root / redirecting to landing
      '/g24',             // Landing page
      '/login',
      '/first-registration',
      '/forget',
      '/reset-password'
    ];
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects || event.url;
       this.showHeaderFooter = !hideHeaderFooterRoutes.includes(url);
      });
  
  }
  switchLanguage(lang: string) {
    this.currentLang.set(lang);  // update the signal
    this.translateService.use(lang);
  }
}
