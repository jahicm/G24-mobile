import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-piechart',
  standalone: true,
  templateUrl: './pie-chart.component.html',
  imports: [TranslateModule],
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnChanges, AfterViewInit {
  @Input() data: number[] = [];
  @ViewChild('pieCanvas', { static: false }) pieCanvas!: ElementRef<HTMLCanvasElement>;
  chartLabel: string = '';
  public chart: any;
  labels: string[] = [];
  isViewInitialized = false;

  constructor(private translate: TranslateService) {
    this.translate.get([
      'statistics.sugar-statistics',
      'statistics.normal',
      'statistics.high',
      'statistics.low',
      'statistics.elevated'
    ]).subscribe(translations => {
      this.chartLabel = translations['statistics.sugar-statistics'];
      this.labels = [
        translations['statistics.normal'],
        translations['statistics.high'],
        translations['statistics.low'],
        translations['statistics.elevated']
      ];
    });
  }
  ngAfterViewInit() {
    this.isViewInitialized = true;
    if (this.data.length > 0) {
      this.createChart();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data.length > 0 && this.isViewInitialized) {
      this.createChart();
    }
  }

  createChart() {
    if (this.chart) {
      this.chart.destroy(); // prevent chart stacking
    }

    this.chart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: {
        labels: this.labels,
        datasets: [{
          data: this.data,
          backgroundColor: [
            'rgba(18, 139, 24, 1)',
            'rgba(173, 13, 13, 0.9)',
            'rgb(255, 205, 86)',
            'rgb(23, 2, 202)'
          ],
          hoverOffset: 4
        }]
      },
      options: {
        aspectRatio: 2.5,
        plugins: {
          title: {
            display: true,
            text: this.chartLabel,
            font: {
              size: 24,
              weight: 'bold',
              family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
            },
            padding: {
              top: 10,
              bottom: 30
            }
          },
          legend: {
            display: true,
            labels: {
              font: {
                size: 14,
                family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif"
              }
            }
          }
        }
      }
    });
  }
}
