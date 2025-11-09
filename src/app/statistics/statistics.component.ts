import { Component, OnInit } from '@angular/core';
import { PieChartComponent } from '../chart/pie-chart/pie-chart.component';
import { SharedService } from '../services/shared.service';
import { User } from '../models/user';
import { Entry } from '../models/entry';
import { Utility } from '../utils/utility';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-statistics',
  imports: [PieChartComponent, FormsModule,TranslateModule],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements OnInit {

  user: User = {
    userId: '',
    name: '',
    lastName: '',
    dob: new Date(),
    postCode:'',
    country: '',
    unit: '',
    diabetesType: '',
    medication: '',
    email: '',
    password: '',
    password_repeat: ''
  };

  startDate: string = '';
  endDate: string = '';
  entries: Entry[] = [];
  data: number[] = [];
  filteredGraphValues: Entry[] = [];
  isLoading: boolean = true; 

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {

    this.sharedService.user$.subscribe({
      next: user => {
        if (user) this.user = user;
      },
      error: err => {
        console.error('Failed to load user', err);
      }
    });

    this.sharedService.entries$.subscribe({
      next: entries => {
        this.isLoading = false;
        this.entries = entries;
        this.filteredGraphValues = entries;
        this.generatePieChart();
      },
      error: err => {
        this.isLoading = false;
        console.error('Failed to load entries', err);
      }
    });
    this.sharedService.loadUser(this.user.userId, false);
    this.sharedService.loadEntries(this.user.userId, true);
  }

  generatePieChart(): void {
    const grouped = this.filteredGraphValues.reduce((acc, entry) => {
      const key = entry.status;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const lowCount = grouped['low'] || 0;
    const normalCount = grouped['normal'] || 0;
    const elevatedCount = grouped['elevated'] || 0;
    const highCount = grouped['high'] || 0;

    const total = lowCount + normalCount + elevatedCount + highCount;

    const percentages = {
      low: total > 0 ? (lowCount / total) * 100 : 0,
      normal: total > 0 ? (normalCount / total) * 100 : 0,
      elevated: total > 0 ? (elevatedCount / total) * 100 : 0,
      high: total > 0 ? (highCount / total) * 100 : 0
    };

    this.data = [
      percentages['normal'],
      percentages['high'],
      percentages['low'],
      percentages['elevated']
    ];

  }

  filterPieChart(): void {
    if (!this.startDate || !this.endDate) {
      return;
    }
    this.filteredGraphValues = Utility.convertStringToDateAndFilter(this.entries, this.startDate, this.endDate);
    this.generatePieChart();
  }
}
