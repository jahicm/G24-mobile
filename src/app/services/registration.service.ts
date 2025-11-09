import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  constructor(private httpClient: HttpClient) { }

  registerUser(user: User) {
    return this.httpClient.post<User>(`${environment.apiBaseUrl}/register`, user);
  }
  firstRegistration(user: User) {
    return this.httpClient.post<User>(`${environment.apiBaseUrl}/first-registration`, user);
  }
  resetPassword(body: any) {
    return this.httpClient.post<void>(`${environment.apiBaseUrl}/reset-password`, body);
  }
}