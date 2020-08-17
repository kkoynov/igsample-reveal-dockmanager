import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { IgxDataChartComponent, IgxLegendComponent } from 'igniteui-angular-charts';

import * as _ from 'lodash';
import { SampleDataService } from '../sample-data.service';

@Component({
  selector: 'app-store-incomes-chart',
  templateUrl: './store-incomes-chart.component.html',
  styleUrls: ['./store-incomes-chart.component.scss']
})
export class StoreIncomesChartComponent implements OnInit, AfterViewInit {

  @ViewChild('legend', { read: IgxLegendComponent, static: true }) public legend: IgxLegendComponent;
  @ViewChild('chart', { read: IgxDataChartComponent, static: true }) public chart: IgxDataChartComponent;

  public data: any[];

  constructor(private sampleDataSvc: SampleDataService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
  }

  async loadData(selectedStores: any[]): Promise<any> {
    return this.sampleDataSvc.get('Incomes.json')
    .then((data: any) => {
      this.data = [];
      const selData = _.filter(data, (item) => {
        return (item.FiscalYear == 2019) && (selectedStores.indexOf(item.StoreId)>-1);
      });
      const invData = {};
      for(let item of selData) {
        if (!_.has(invData, item.StoreId)) {
          invData[item.StoreId] = {
            StoreId: item.StoreId,
            FiscalYear: item.FiscalYear
          };
        }
        invData[item.StoreId][item.Season + 'Revenue'] = item.Revenue;
        invData[item.StoreId][item.Season + 'PhCost'] = item.PhCost;
      }
      this.data = _.map(invData, (item) => item);

      if (!!this.chart) {
        this.chart.bindData();
        this.chart.flush();
      }
    })
    .catch((error: Error) => console.log(error))
    ;
  }


}
