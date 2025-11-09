import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private httpClient: HttpClient) { }

  sendPasswordResetEmail(email: string) {

    return this.httpClient.post<string>(`${environment.apiBaseUrl}/forgot-password?email=${encodeURIComponent(email)}`,null);
  }
}
