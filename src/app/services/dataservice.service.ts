import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Entry } from '../models/entry';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(private httpClient: HttpClient) { }

  getData(userId: string): Observable<Entry[]> {
    return this.httpClient.get<Entry[]>(`${environment.apiBaseUrl}/getdata/${userId}`);
  }
}
