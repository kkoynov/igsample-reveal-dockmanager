import { Component, Output, OnInit, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { IgxGridComponent, IgxColumnComponent, ISortingExpression, SortingDirection, DefaultSortingStrategy } from '@infragistics/igniteui-angular';

import * as _ from 'lodash';
import { SampleDataService } from '../sample-data.service';

@Component({
  selector: 'app-stores-grid',
  templateUrl: './stores-grid.component.html',
  styleUrls: ['./stores-grid.component.scss']
})
export class StoresGridComponent implements OnInit {
  //@ViewChild('grid') private el: ElementRef;
  @ViewChild('grid', { read: IgxGridComponent, static: true }) public grid: IgxGridComponent;
  public expr: ISortingExpression[];

  public localData: any[];
  @Output() rowSelectionChanged = new EventEmitter<any>();

  constructor(private sampleDataSvc: SampleDataService) {
    
    this.expr = [
      { dir: SortingDirection.Asc, fieldName: "Country", ignoreCase: false,
        strategy: DefaultSortingStrategy.instance() },
      { dir: SortingDirection.Asc, fieldName: "State", ignoreCase: false,
        strategy: DefaultSortingStrategy.instance() }
    ];
  }

  async loadData(filter?: any): Promise<any> {
    return this.sampleDataSvc.get('Stores.json')
    .then((data: any) => {
      this.localData = (!!filter) ? _.filter(data, filter) : data;
    })
    .catch((error: Error) => console.log(error))
    ;
  }

  ngOnInit(): void {
  }

  public onColumnInit(column: IgxColumnComponent) {
    if (column.field === 'RegistererDate') {
      column.formatter = (date => date.toLocaleDateString());
    }
  }

  public onRowSelectionChange(args: any) {
    console.log('onRowSelectionChange', args);
    this.rowSelectionChanged.emit(args.newSelection);
  }
}
