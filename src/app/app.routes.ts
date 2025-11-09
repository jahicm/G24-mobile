import { Routes } from '@angular/router';
import { BaseComponent } from './base/base.component';
import { DataComponent } from './data/data.component';
import { AnalyserComponent } from './analyser/analyser.component';
import { RegistrationComponent } from './registration/registration.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { LoginComponent } from './login/login.component';
import { authGuard } from './auth/auth-guard';
import { FirstRegistrationComponent } from './first-registration/first-registration.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgetComponent } from './forget/forget.component';
import { G24Component } from './g24/g24.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: G24Component },             // Root zeigt G24Component
  { path: 'registration', component: RegistrationComponent },
  { path: 'first-registration', component: FirstRegistrationComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'forget', component: ForgetComponent },
  { path: 'data', component: DataComponent, canActivate: [authGuard] },
  { path: 'analyser', component: AnalyserComponent, canActivate: [authGuard] },
  { path: 'statistics', component: StatisticsComponent, canActivate: [authGuard] },
  { path: 'base', component: BaseComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
