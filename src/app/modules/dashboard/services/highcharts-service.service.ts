import * as Highcharts from 'highcharts';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HighchartsServiceService {

  constructor() { }

  createChart(el:any, cfg:any) {
    Highcharts.chart(el, cfg);
  }
}
