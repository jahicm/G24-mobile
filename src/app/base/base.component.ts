import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { Entry } from '../models/entry';
import { SharedService } from '../services/shared.service';
import { User } from '../models/user';
import { FormsModule } from '@angular/forms';
import { filter, Subject, take, takeUntil } from 'rxjs';
import { DiabetesDashboard } from '../models/dashboard/diabetes-dashboard';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Utility } from '../utils/utility';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { EntryPayload } from '../models/entry-payload';

@Component({
  selector: 'app-base',
  imports: [CommonModule, ChartComponent, FormsModule, TranslateModule],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css',
})
export class BaseComponent implements OnInit,OnDestroy {


  filteredValues: Entry[] = [];
  filteredGraphValues: Entry[] = [];
  fromDate: string = '';
  toDate: string = '';
  chartLabels: string[] = [];
  measurementTimeLabels: string[] = [];
  measurementValueLabels: number[] = [];
  user?: User | null;
  timeOfMeal?: Date;
  dateTime?: Date;
  dashboard?: DiabetesDashboard;
  private destroy$ = new Subject<void>();
  selectedTimeOfMeal = ''
  loading: boolean = true;


  constructor(private sharedService: SharedService, private datePipe: DatePipe, private translate: TranslateService, private userService: UserService, private router: Router) {
    this.loading = true;
  }
  ngOnInit(): void {

    this.selectedTimeOfMeal = "fasting";
    const userId = Utility.decodeUserIdFromToken(sessionStorage.getItem('token') || '');

    this.sharedService.loadUser(userId, true);
    this.sharedService.loadEntries(userId, true);
    this.sharedService.loadDashboard(userId, true);


    this.sharedService.user$
      .pipe(filter(user => !!user), take(1))  // Waits for real value
      .subscribe(user => {
        this.user = user;
      });

    this.sharedService.entries$
      .pipe(takeUntil(this.destroy$))
      .subscribe(entries => {
        this.filteredValues = entries;

        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 7);
        const toDate = new Date();
        if (this.filteredValues != null && this.filteredValues.length > 0) {
          this.generateGraph(fromDate, toDate);
        }
      });

    this.sharedService.dashboardSubject$
      .pipe(takeUntil(this.destroy$))
      .subscribe(dashboard => {
        if (dashboard) {
          this.dashboard = dashboard;
          this.loading = false;
        }
      });

  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  generateGraph(fromDate: Date, toDate: Date): void {

    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(23, 59, 59, 999);

    this.filteredGraphValues = this.filteredValues.filter(entry => {

      Utility.normalizeUnit(entry, this.user!);
      const entryDate = new Date(entry.measurementTime);
      return entryDate >= fromDate && entryDate <= toDate;
    });

    this.measurementTimeLabels = this.filteredGraphValues.map(entry =>
      this.datePipe.transform(entry.measurementTime, 'dd/MM/yyyy') || ''
    );

    this.measurementValueLabels = this.filteredGraphValues.map(entry => entry.sugarValue);
  }
  onSubmit(form: any): void {
    const formData = form.value;
    const userId = form.userId;
    const measurementTime = formData.dateTime ? new Date(formData.dateTime) : new Date();
    const sugarValue = Number(formData.sugarValue);
    const value = formData.timeOfMeal;
    const dataEntryTime = new Date();
    const referenceValue = 0; // example fixed value
    const timeSlot = formData.measurementTime
    let status = '';


    const newEntry: Entry = {
      userId,
      dataEntryTime,
      measurementTime,
      sugarValue,
      value,
      unit: formData.unit,
      referenceValue,
      status
    };

    const entryPayload: EntryPayload = {
      userId: newEntry.userId,
      dataEntryTime: this.toLocalDateTimeString(newEntry.dataEntryTime),
      measurementTime: this.toLocalDateTimeString(newEntry.measurementTime),
      value: newEntry.value,
      sugarValue: newEntry.sugarValue,
      unit: newEntry.unit,
      referenceValue: newEntry.referenceValue,
      status: newEntry.status
    };
    
    this.sharedService.addEntry(this.user!.userId, entryPayload).subscribe(savedEntry => {
      this.sharedService.loadEntries(this.user!.userId);
    });
    alert(this.translate.instant('error.thankyou'));
    form.resetForm();
  }
  deleteProfile() {
    if (!this.user) {
      return;
    }
    this.userService.deleteProfile(this.user.userId).subscribe({
      next: (result) => {
        if (result) {
          alert(this.translate.instant('dashboard.delete_profile.delete_ok'));
          sessionStorage.removeItem('cachedUser');
          sessionStorage.removeItem('lastUserId');
          this.router.navigate(['/login']);
        } else {
          alert(this.translate.instant('dashboard.delete_profile.delete_nok'));
        }
      },
      error: (err) => {
        console.error('Delete failed', err);
        alert(this.translate.instant('dashboard.delete_profile.delete_nok'));
      }
    });
  }
  toLocalDateTimeString(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }

}
