import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [],
})
export class DonaComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.doughnutChartData.labels = this.doughnutChartLabels;
    this.doughnutChartData.datasets = this.data;
  }
  @Input() title: string = 'Sin titulo';
  @Input('labels') doughnutChartLabels: string[] = [
    'label-1',
    'label-2',
    'label-3',
  ];
  @Input() data: any = [{ data: [350, 450, 100] }];
  // [{ data: [350, 450, 100] }]
  // Doughnut

  public doughnutChartData: ChartData<'doughnut'> = {
    labels: this.doughnutChartLabels,
    datasets: [{ data: [350, 450, 100] }],
  };
  public doughnutChartType: ChartType = 'doughnut';
}
