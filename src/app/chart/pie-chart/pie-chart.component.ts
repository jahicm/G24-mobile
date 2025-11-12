import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-piechart',
  standalone: true,
  templateUrl: './pie-chart.component.html',
  imports: [TranslateModule],
  styleUrls: ['./pie-chart.component.css']
})
export class PieChartComponent implements OnChanges, AfterViewInit, OnDestroy {
  @Input() data: number[] = [];
  @ViewChild('pieCanvas', { static: false }) pieCanvas!: ElementRef<HTMLCanvasElement>;

  chartLabel: string = '';
  public chart: Chart | undefined;
  labels: string[] = [];
  isViewInitialized = false;

  private resizeListener: any;

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

    // Add window resize listener
    this.resizeListener = () => this.updateChartSize();
    window.addEventListener('resize', this.resizeListener);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data.length > 0 && this.isViewInitialized) {
      this.createChart();
    }
  }

  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
    window.removeEventListener('resize', this.resizeListener);
  }

  private updateChartSize() {
    const canvas = this.pieCanvas.nativeElement;
    const containerWidth = canvas.parentElement?.offsetWidth || 300;

    if (containerWidth < 768) {
      canvas.height = 250;
    } else if (containerWidth < 1200) {
      canvas.height = 350;
    } else {
      canvas.height = 400;
    }

    if (this.chart) {
      this.chart.resize();
    }
  }

  private createChart() {
    if (this.chart) {
      this.chart.destroy();
    }

    const canvas = this.pieCanvas.nativeElement;

    this.chart = new Chart(canvas, {
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
        responsive: true,
        maintainAspectRatio: false, // <-- allow dynamic height
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

    // Set initial chart size
    this.updateChartSize();
  }
}