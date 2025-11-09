import { Component } from '@angular/core';
import { AnalyserService } from '../services/analyser.service';
import { HttpEventType } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-analyser',
  templateUrl: './analyser.component.html',
  imports: [CommonModule, TranslateModule],
  styleUrls: ['./analyser.component.css']
})
export class AnalyserComponent {
  selectedFile: File | null = null;
  uploadProgress = 0;
  isUploading = false;
  result = '';
  errorMessage = '';

  constructor(private analyserService: AnalyserService) { }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    this.uploadProgress = 0;
    this.result = '';
    this.errorMessage = '';
  }

  upload() {
    if (!this.selectedFile) {
      return;
    }
    let langauge = sessionStorage.getItem('lang')||'en';

    this.isUploading = true;
    this.errorMessage = '';

    this.analyserService.uploadFile(this.selectedFile,langauge).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round((event.loaded / (event.total ?? 1)) * 100);
        } else if (event.type === HttpEventType.Response) {
          this.isUploading = false;
          if (event?.body) {
            if (typeof event.body === 'string') {
              try {
                // Try parsing as JSON
                const json = JSON.parse(event.body);
                this.result = this.convertJsonToText(json); // convert JSON to text
              } catch (e) {
                // Not JSON, treat as plain text
                this.result = event.body;
              }
            } else {
              // Already JSON object
              this.result = this.convertJsonToText(event.body);
            }
          } else {
            this.result = 'No response received from the server.';
          }
        }
      },
      error: (err) => {
        this.isUploading = false;
        this.errorMessage = 'Upload failed. Please try again.';
        console.error(err);
      }
    });

  }
  convertJsonToText(obj: any, indent: string = ''): string {
    let result = '';
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          result += `${indent}${this.capitalize(key)}:\n`;
          result += this.convertJsonToText(value, indent + '  ');
        } else if (Array.isArray(value)) {
          result += `${indent}${this.capitalize(key)}:\n`;
          value.forEach((v, i) => {
            result += typeof v === 'object'
              ? this.convertJsonToText(v, indent + '  - ')
              : `${indent}  - ${v}\n`;
          });
        } else {
          result += `${indent}${this.capitalize(key)}: ${value}\n`;
        }
      }
    }
    return result;
  }

  capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
  }

}
