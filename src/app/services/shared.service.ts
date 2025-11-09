import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from '../models/user';
import { Entry } from '../models/entry';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { isEqual } from 'lodash';
import { DiabetesDashboard } from '../models/dashboard/diabetes-dashboard';
import { Reading } from '../models/dashboard/reading';
import { GlucoseAnalysis, TimeSlot } from '../models/dashboard/glucose-analysis';
import { SmartInsight, PriorityLevel } from '../models/dashboard/smart-insight';
import { EntryPayload } from '../models/entry-payload';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private entriesSubject = new BehaviorSubject<Entry[]>([]);
  entries$: Observable<Entry[]> = this.entriesSubject.asObservable();

  private dashboardSubject = new BehaviorSubject<DiabetesDashboard | null>(null);
  dashboardSubject$: Observable<DiabetesDashboard | null> = this.dashboardSubject.asObservable();

  private lastUserId: string | null = null;
  private lastEntriesUserId: string | null = null;
  private lastDashboardUserId: string | null = null;
  private forceReload = false;
  private loading: boolean = false

  constructor(private httpClient: HttpClient) {
    this.loadUserFromSessionStorage();
    this.loading = true;
  }

  getLoading(): boolean {
    return this.loading;
  }
  private loadUserFromSessionStorage(): void {
    const cachedUser = sessionStorage.getItem('cachedUser');
    const cachedUserId = sessionStorage.getItem('lastUserId');
    if (cachedUser && cachedUserId) {
      this.userSubject.next(JSON.parse(cachedUser));
      this.lastUserId = cachedUserId;
    }
  }

  private saveUserToSessionStorage(): void {
    if (this.userSubject.value) {
      sessionStorage.setItem('cachedUser', JSON.stringify(this.userSubject.value));
      sessionStorage.setItem('lastUserId', this.lastUserId || '');
    }
  }

  loadUser(userId: string, forceReload: boolean = false): void {
    if (!forceReload && this.lastUserId === userId && this.userSubject.value !== null) {
      return;
    }

    this.httpClient.get<User>(`${environment.apiBaseUrl}/user/${userId}`)
      .pipe(
        catchError(error => {
          this.loading = false
          console.error(`Error loading user for ID ${userId}:`, error);
          return throwError(() => new Error('Failed to load user'));
        }),
        tap(user => {
          this.lastUserId = userId;
          if (!isEqual(this.userSubject.value, user)) {
            this.userSubject.next(user);
            this.saveUserToSessionStorage();
            
          }
        })
      )
      .subscribe();
  }

  loadEntries(userId: string, forceReload: boolean = false): void {
    if (!forceReload && this.lastEntriesUserId === userId && this.entriesSubject.value.length > 0) {
      return;
    }

    this.httpClient.get<Entry[]>(`${environment.apiBaseUrl}/getdata/${userId}`)
      .pipe(
        catchError(error => {
          console.error(`Error loading entries for ID ${userId}:`, error);
          return throwError(() => new Error('Failed to load entries'));
        }),
        tap(entries => {
          this.lastEntriesUserId = userId;
          if (entries != null && !isEqual(this.entriesSubject.value, entries)) {
            this.entriesSubject.next(entries);
            this.forceReload = true;
          }
        })
      )
      .subscribe();
  }

  loadDashboard(userId: string, forceReload: boolean = false): void {
    if (!forceReload && this.lastDashboardUserId === userId && this.dashboardSubject.value !== null) {
      return;
    }


    this.httpClient.get(`${environment.apiBaseUrl}/dashboard/${userId}`)
      .pipe(
        catchError(error => {
          console.error(`Error loading dashboard for ID ${userId}:`, error);
          return throwError(() => new Error('Failed to load dashboard'));
        }),
        tap(response => {

          this.lastDashboardUserId = userId;
          const dashboard = response
            ? DiabetesDashboard.fromJson(response)
            : new DiabetesDashboard(
              new Reading(0, '', ''),
              new Reading(0, '', ''),
              [],
              [],
              new GlucoseAnalysis(0, '', '', 0, 0, new TimeSlot('', 0,), new TimeSlot('', 0), [], 0),
              new SmartInsight('', '', '', '#00C851' as PriorityLevel),
              { generatedAt: new Date(), apiVersion: '1.0' }
            );

          if (!isEqual(this.dashboardSubject.value, dashboard)) {
            this.dashboardSubject.next(dashboard);
          }
        })
      )
      .subscribe();
  }

  updateUser(user: User): void {
    if (!isEqual(this.userSubject.value, user)) {
      this.userSubject.next(user);
      this.saveUserToSessionStorage();
      this.lastDashboardUserId = null;
      this.dashboardSubject.next(null);
    }
  }

  updateEntries(entries: Entry[]): void {
    if (!isEqual(this.entriesSubject.value, entries)) {
      this.entriesSubject.next(entries);
    }
  }

  addEntry(userId: string, entryPayload: EntryPayload): Observable<Entry> {
    entryPayload.userId = userId;
    return this.httpClient.post<Entry>(`${environment.apiBaseUrl}/addEntry`, entryPayload)
      .pipe(
        tap(newEntry => {
          if (this.lastEntriesUserId === userId) {
            const currentEntries = this.entriesSubject.value;
            const updatedEntries = [...currentEntries, newEntry];
            this.entriesSubject.next(updatedEntries);
          }
          this.lastDashboardUserId = null;
          this.dashboardSubject.next(null);
        }),
        catchError(error => {
          console.error('Error adding entry:', error);
          return throwError(() => new Error('Failed to add entry'));
        })
      );
  }

  clear(): void {
    this.lastUserId = null;
    this.lastEntriesUserId = null;
    this.lastDashboardUserId = null;
    this.userSubject.next(null);
    this.entriesSubject.next([]);
    this.dashboardSubject.next(null);
    sessionStorage.removeItem('cachedUser');
    sessionStorage.removeItem('lastUserId');

  }

}