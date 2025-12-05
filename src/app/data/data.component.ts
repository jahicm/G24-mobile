import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Entry } from '../models/entry';
import { ChartComponent } from '../chart/chart.component';
import { FormsModule } from '@angular/forms';
import { Utility } from '../utils/utility';
import { DataService } from '../services/dataservice.service';
import { User } from '../models/user';
import { SharedService } from '../services/shared.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Subscription } from 'rxjs';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-data',
  standalone: true,
  imports: [CommonModule, ChartComponent, FormsModule, TranslateModule],
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit, OnDestroy {
  entries: Entry[] = [];
  pagedEntries: Entry[] = [];
  currentPage = 1;
  pageSize = 10;
  filteredValues: Entry[] = [];
  filteredGraphValues: Entry[] = [];
  user: User | null = null;
  fromDate: string = '';
  toDate: string = '';
  measurementTimeLabels: string[] = [];
  measurementValueLabels: number[] = [];
  data: any;
  maxVisiblePages = 8;
  totalPages: number = 0;

  // Sorting states
  currentSort: { field: string; order: 'asc' | 'desc' | 'default' } = { field: '', order: 'default' };
  currentStatusFilter: string = 'default';

  private subscriptions: Subscription[] = [];

  constructor(
    private datePipe: DatePipe,
    private dataService: DataService,
    private sharedService: SharedService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    const userId = Utility.decodeUserIdFromToken(localStorage.getItem('token') || '');

    // Subscribe to user changes
    const userSub = this.sharedService.user$.subscribe(user => {
      this.user = user;
    });

    // Subscribe to entries changes
    const entriesSub = this.sharedService.entries$.subscribe(entries => {
      this.entries = entries;
      this.resetFilters();
    });

    this.subscriptions.push(userSub, entriesSub);

    // Load data
    this.sharedService.loadUser(userId);
    this.sharedService.loadEntries(userId);

    // Initialize dates for filtering (default to last 30 days)
    this.initializeDefaultDates();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeDefaultDates(): void {
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 30);

    this.toDate = this.formatDateForInput(toDate);
    this.fromDate = this.formatDateForInput(fromDate);
  }

  private formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  get totalPagesArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  get visiblePages(): number[] {
    const pages = [];
    const totalPages = this.totalPages;

    if (totalPages <= this.maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(this.currentPage - Math.floor(this.maxVisiblePages / 2), 1);
      let end = Math.min(start + this.maxVisiblePages - 1, totalPages);

      if (end - start + 1 < this.maxVisiblePages) {
        start = Math.max(end - this.maxVisiblePages + 1, 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  }

  get totalRecords(): number {
    return this.filteredValues.length;
  }

  setupPagination(): void {
    this.totalPages = Math.ceil(this.filteredValues.length / this.pageSize);
    this.updatePagedEntries();
  }

  updatePagedEntries(): void {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = Math.min(start + this.pageSize, this.filteredValues.length);
    this.pagedEntries = this.filteredValues.slice(start, end);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updatePagedEntries();
  }

  goToFirstPage(): void {
    this.goToPage(1);
  }

  goToLastPage(): void {
    this.goToPage(this.totalPages);
  }

  goToPrevPage(): void {
    this.goToPage(this.currentPage - 1);
  }

  goToNextPage(): void {
    this.goToPage(this.currentPage + 1);
  }

  resetFilters(): void {
    this.filteredValues = [...this.entries];
    this.currentSort = { field: '', order: 'default' };
    this.currentStatusFilter = 'default';
    this.currentPage = 1;
    this.setupPagination();
  }

  sortByValue(order: 'high' | 'low' | 'default'): void {
    this.currentSort = { field: 'value', order: order === 'default' ? 'default' : order === 'high' ? 'asc' : 'desc' };

    if (order === 'high') {
      this.filteredValues.sort((a, b) => b.sugarValue - a.sugarValue);
    } else if (order === 'low') {
      this.filteredValues.sort((a, b) => a.sugarValue - b.sugarValue);
    } else {
      this.resetFilters();
      return;
    }

    this.currentPage = 1;
    this.setupPagination();
  }

  sortByDate(order: 'asc' | 'desc' | 'default'): void {
    this.currentSort = { field: 'date', order };

    if (order === 'asc') {
      this.filteredValues.sort((a, b) =>
        new Date(a.measurementTime).getTime() - new Date(b.measurementTime).getTime()
      );
    } else if (order === 'desc') {
      this.filteredValues.sort((a, b) =>
        new Date(b.measurementTime).getTime() - new Date(a.measurementTime).getTime()
      );
    } else {
      this.resetFilters();
      return;
    }

    this.currentPage = 1;
    this.setupPagination();
  }

  sortByStatus(status: 'high' | 'norm' | 'elev' | 'low' | 'default'): void {
    this.currentStatusFilter = status;

    if (status === 'default') {
      this.filteredValues = [...this.entries];
    } else {
      this.filteredValues = this.entries.filter(entry => entry.status === status);
    }

    this.currentPage = 1;
    this.setupPagination();
  }

  generateGraph(): void {
    if (!this.validateDates()) {
      alert(this.translate.instant('error.select-dates'));
      return;
    }

    if (!this.user) {
      alert(this.translate.instant('error.user-not-found'));
      return;
    }

    // Apply unit normalization
    const normalizedEntries = this.entries.map(entry => {
      const normalizedEntry = { ...entry };
      Utility.normalizeUnit(normalizedEntry, this.user!);
      return normalizedEntry;
    });

    // Filter by date range
    this.filteredGraphValues = Utility.convertStringToDateAndFilter(
      normalizedEntries,
      this.fromDate,
      this.toDate
    );

    if (this.filteredGraphValues.length === 0) {
      alert(this.translate.instant('error.no-data-range'));
      return;
    }

    // Prepare data for chart
    this.measurementTimeLabels = this.filteredGraphValues.map(entry =>
      this.datePipe.transform(entry.measurementTime, 'dd/MM/yyyy HH:mm') || ''
    );

    this.measurementValueLabels = this.filteredGraphValues.map(entry => entry.sugarValue);
  }

  private validateDates(): boolean {
    if (!this.fromDate || !this.toDate) {
      return false;
    }

    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);

    if (from > to) {
      alert(this.translate.instant('error.invalid-date-range'));
      return false;
    }

    return true;
  }

  async generatePDF(): Promise<void> {
    if (!this.validateDates()) {
      alert(this.translate.instant('error.pdf-error'));
      return;
    }

    if (!this.user) {
      alert(this.translate.instant('error.user-not-found'));
      return;
    }

    try {
      // Normalize entries for user unit
      const normalizedEntries = this.entries.map(entry => {
        const normalizedEntry = { ...entry };
        Utility.normalizeUnit(normalizedEntry, this.user!);
        return normalizedEntry;
      });

      const filteredEntries = Utility.convertStringToDateAndFilter(
        normalizedEntries,
        this.fromDate,
        this.toDate
      );

      if (filteredEntries.length === 0) {
        alert(this.translate.instant('error.no-data-pdf'));
        return;
      }

      // Sort entries by date ascending
      const sortedEntries = [...filteredEntries].sort((a, b) =>
        new Date(a.measurementTime).getTime() - new Date(b.measurementTime).getTime()
      );

      const values = sortedEntries.map(e => e.sugarValue);
      const highest = Math.max(...values);
      const lowest = Math.min(...values);
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;

      const doc = new jsPDF();
      const unitLabel = this.user.unit === '1' ? 'mg/dL' : 'mmol/L';

      // Title
      doc.setFontSize(16);
      doc.text(this.translate.instant('pdf.title'), 14, 15);

      // User details
      const details = [
        `${this.translate.instant('pdf.full-name')}: ${this.user.name} ${this.user.lastName}`,
        `${this.translate.instant('pdf.dob')}: ${this.user.dob}`,
        `${this.translate.instant('pdf.diabetes-type')}: ${this.user.diabetesType}`,
        `${this.translate.instant('pdf.city')}: ${this.user.city}`,
        '----------------------------------',
        `${this.translate.instant('pdf.report-period')}: ${this.formatDateForDisplay(this.fromDate)} - ${this.formatDateForDisplay(this.toDate)}`,
        `${this.translate.instant('pdf.highest')}: ${highest.toFixed(1)} ${unitLabel}`,
        `${this.translate.instant('pdf.lowest')}: ${lowest.toFixed(1)} ${unitLabel}`,
        `${this.translate.instant('pdf.average')}: ${average.toFixed(2)} ${unitLabel}`,
        `${this.translate.instant('pdf.records-count')}: ${sortedEntries.length}`,
        '----------------------------------'
      ];

      let yPosition = 25;
      details.forEach(line => {
        doc.text(line, 14, yPosition);
        yPosition += 6;
      });

      const tableData = sortedEntries.map(entry => [
        formatDate(entry.measurementTime, 'HH:mm dd.MM.yyyy', 'de-DE'),
        `${entry.sugarValue.toFixed(1)} ${unitLabel}`
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [[this.translate.instant('pdf.date'), this.translate.instant('pdf.value')]],
        body: tableData,
        margin: { left: 14 },
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185] }
      });

      // Save & share PDF
      const pdfBlob = doc.output('blob');
      await this.saveAndSharePDF(pdfBlob);

    } catch (error) {
      console.error('PDF generation error:', error);
      alert(this.translate.instant('error.pdf-generation-failed'));
    }
  }
  async buildTableData(sortedEntries: Entry[], unitLabel: string) {
    const tableData = [];

    for (const entry of sortedEntries) {
      const translated = await this.translate
        .get('dashboard.add_reading.' + entry.status)
        .toPromise();

      tableData.push([
        formatDate(entry.measurementTime, 'HH:mm dd.MM.yyyy', 'de-DE'),
        `${translated} ${entry.sugarValue.toFixed(1)} ${unitLabel}`
      ]);
    }

    return tableData;
  }
  private async saveAndSharePDF(pdfBlob: Blob): Promise<void> {
    const base64Data = await this.convertBlobToBase64(pdfBlob);
    const fileName = `blood-sugar-report-${Date.now()}.pdf`;

    // Save file in app-specific Documents directory
    await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Documents,
      recursive: true
    });

    // Get file URI
    const uriResult = await Filesystem.getUri({
      path: fileName,
      directory: Directory.Documents
    });

    // Share the file
    await Share.share({
      title: this.translate.instant('pdf.share-title'),
      text: this.translate.instant('pdf.share-text'),
      url: uriResult.uri,
      dialogTitle: this.translate.instant('pdf.share-dialog-title')
    });
  }

  private convertBlobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  private formatDateForDisplay(dateString: string): string {
    const date = new Date(dateString);
    return this.datePipe.transform(date, 'dd.MM.yyyy') || dateString;
  }

}