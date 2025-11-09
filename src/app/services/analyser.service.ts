import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyserService {

  constructor(private httpClient: HttpClient) { }

  /**
   * Uploads a file to the server.
   * @param file The file to upload.
   * @returns An observable that emits the upload progress and response.
   */
  uploadFile(file: File,language:string) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('language', language);
    return this.httpClient.post(`${environment.apiBaseUrl}/getanalysis`, formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}
