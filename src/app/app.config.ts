import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_BASE_HREF, DatePipe } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { tokenInterceptor } from './auth/token.interceptor';
import { FormsModule } from '@angular/forms';

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(withInterceptors([tokenInterceptor])), DatePipe,importProvidersFrom(FormsModule),
  {
    provide: TranslateLoader, // Provide TranslateLoader explicitly
    useFactory: HttpLoaderFactory,
    deps: [HttpClient],
  },
  TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    },
  }).providers!, // Ensure TranslateModule providers are included
    // Optionally, provide TranslateService if needed directly
    TranslateService,
  { provide: APP_BASE_HREF, useValue: '/g24' },
  ],
  
};
