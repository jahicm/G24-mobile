import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient) { }

  saveUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${environment.apiBaseUrl}/user`, user);
  }
  getUser(userId: string): Observable<User> {
    return this.httpClient.get<User>(`${environment.apiBaseUrl}/user/${userId}`);
  }
  deleteProfile(userId: string): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${environment.apiBaseUrl}/delete/${userId}`)
      .pipe(
        catchError((error) => {
          console.error('Error deleting profile:', error);
          return of(false); // return false instead of throwing error
        })
      );
  }
}
