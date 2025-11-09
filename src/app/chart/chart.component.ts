import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartType } from 'chart.js';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-chart',
  imports: [CommonModule, BaseChartDirective, TranslateModule],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css',
})
export class ChartComponent implements OnChanges {
  chartLabel: string = 'Blood sugar value';
  lineChartType: ChartType = 'line';
  @Input() lineChartLabels: string[] = [];
  @Input() data: number[] = [];
  lineChartData: any;
  lineChartOptions: any;

  constructor(private translate: TranslateService) {
    this.translate.get('dashboard.line-chart.chart-title').subscribe((label: string) => {
      this.chartLabel = label;
      this.updateChartData();
    });
    this.lineChartOptions = {
     
      scales: {
        x: {
          title: {
            display: true,
            
          },
          
      },
        y: {
          title: {
            display: true,
            
          },
        },
      },
    };
    this.updateChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateChartData();
  }

  private updateChartData(): void {
    this.lineChartData = {
      labels: this.lineChartLabels,
      datasets: [
        {
          label: this.chartLabel,
          data: this.data,
          borderColor: '#2f80ed',
          backgroundColor: 'rgba(161, 198, 247, 0.4)',
          tension: 0.3
        },
      ],
    };
  }
}
