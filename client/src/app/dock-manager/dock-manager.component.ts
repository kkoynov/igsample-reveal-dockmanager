import { Component, ViewChild, ElementRef, OnInit, AfterViewInit, ComponentFactory, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { IgcDockManagerLayout,
  IgcDockManagerComponent,
  IgcDockManagerPane, IgcTabGroupPane, IgcContentPane,
  IgcDockManagerPaneType,
  IgcSplitPaneOrientation
} from '@infragistics/igniteui-dockmanager';
import { RevealComponent } from '../reveal/reveal.component';
import { StoreIncomesChartComponent } from '../store-incomes-chart/store-incomes-chart.component';

import { StoresGridComponent } from '../stores-grid/stores-grid.component';

import * as _ from 'lodash';

@Component({
  selector: 'app-dock-manager',
  templateUrl: './dock-manager.component.html',
  styleUrls: ['./dock-manager.component.scss']
})
export class DockManagerComponent implements OnInit, AfterViewInit {
  @ViewChild('dockManager') private el: ElementRef;
  private dockManager: IgcDockManagerComponent;
  
  @ViewChild(RevealComponent) private reveal: RevealComponent;
  @ViewChild(StoreIncomesChartComponent) private storeIncomesChart: StoreIncomesChartComponent;

  public layout: IgcDockManagerLayout;
  public listViewPane: IgcTabGroupPane;
  public detailViewPane: IgcTabGroupPane;

  @ViewChild('reveal', { read: ViewContainerRef }) private viewContainerRef: ViewContainerRef;
  private factoryStoresGrid: ComponentFactory<StoresGridComponent>;

  storeIncome

  constructor(
    private resolver: ComponentFactoryResolver
  ) {
    this.layout = {
      rootPane: {
        type: IgcDockManagerPaneType.splitPane,
        orientation: IgcSplitPaneOrientation.horizontal,
        floatingWidth: 500,
        size: 200,
        panes: [
          {
            type: IgcDockManagerPaneType.contentPane,
            size: 100,
            header: 'Analytics reports',
            contentId: 'revealView',
            allowClose: false
          },
          {
            type: IgcDockManagerPaneType.splitPane,
            orientation: IgcSplitPaneOrientation.vertical,
            size: 100,
            panes: [
              {
                id: 'listViewPane',
                type: IgcDockManagerPaneType.tabGroupPane,
                size: 60,
                panes: []
              },
              {
                id: 'detailViewPane',
                type: IgcDockManagerPaneType.tabGroupPane,
                size: 40,
                panes: []
              }
            ]
          }
        ]
      },
      floatingPanes: [
        {
          type: IgcDockManagerPaneType.splitPane,
          orientation: IgcSplitPaneOrientation.horizontal,
          floatingHeight: 350,
          floatingWidth: 550,
          floatingLocation: { x: 200, y: 600 },
          panes: [
            {
              type: IgcDockManagerPaneType.contentPane,
              contentId: 'floating',
              header: 'Welcome to Ignite UI'
            }
          ]
        }
      ]
    } as IgcDockManagerLayout;

    this.listViewPane = this.findPane({id: 'listViewPane'}) as IgcTabGroupPane;
    this.detailViewPane = this.findPane({id: 'detailViewPane'}) as IgcTabGroupPane;
  }

  ngOnInit() {
    this.factoryStoresGrid = this.resolver.resolveComponentFactory(StoresGridComponent);
  }

  private findPane(predicate: any): IgcDockManagerPane {
    let found = null;
    function _findPane(collection: Array<IgcDockManagerPane>): IgcDockManagerPane {
      let f = _.find(collection, predicate);
      if (!!f) return f;
      for(let pane of collection) {
        if (_.has(pane, 'panes') && _.isArray(pane['panes'])) f = _findPane(pane['panes']);
        if (!!f) return f;
      }
      return undefined;
    }

    found = _findPane(this.layout.rootPane.panes);
    if (!!found) return found;
    found = _findPane(this.layout.floatingPanes);
    if (!!found) return found;
    return found;
  }
  
  ngAfterViewInit(): void {
    this.dockManager = this.el.nativeElement as IgcDockManagerComponent;

    this.dockManager.layout = JSON.parse(JSON.stringify(this.layout));
  }
  
  async onDataPointClicked(data: any) {
    console.log('onDataPointClicked', data);
    
    this.layout = this.dockManager.layout;
    this.listViewPane = this.findPane({id: 'listViewPane'}) as IgcTabGroupPane;
    this.detailViewPane = this.findPane({id: 'detailViewPane'}) as IgcTabGroupPane;

    const listId = `list-${data.cell.columnName.replace(' ', '_')}-${data.cell.value.replace(' ', '_')}`;

    if (data.dataSource.startsWith('.StoreId.CountryCode')) {
      const filter = Object.create({});
      const grid = this.viewContainerRef.createComponent<StoresGridComponent>(this.factoryStoresGrid);
      filter[data.cell.columnName] = data.cell.value;
      grid.instance.rowSelectionChanged.subscribe((data) => this.onStoresGridSelectionChanged(data));
      await grid.instance.loadData(filter);
      grid.location.nativeElement.setAttribute('slot', listId);
      this.addPane(this.listViewPane, listId, {header: `${data.cell.value}: Stores`});
    }

    this.dockManager.layout = JSON.parse(JSON.stringify(this.layout));
    setTimeout(() => this.reveal.updateView(), 100);
  }
  
  async onStoresGridSelectionChanged(data: any) {
    console.log('onStoresGridSelectionChanged', data);
    
    this.layout = this.dockManager.layout;
    this.listViewPane = this.findPane({id: 'listViewPane'}) as IgcTabGroupPane;
    this.detailViewPane = this.findPane({id: 'detailViewPane'}) as IgcTabGroupPane;

    if (!_.isEmpty(data)) {
      const selectedStores = _.map(data, 'StoreId');
      await this.storeIncomesChart.loadData(selectedStores);
      this.addPane(this.detailViewPane, 'detailStoreIncomesChart', {header: 'Store incomes'});
    }
    else {
      this.removePane(this.detailViewPane, 'detailStoreIncomesChart');
    }
    
    this.dockManager.layout = JSON.parse(JSON.stringify(this.layout));
    setTimeout(() => this.reveal.updateView(), 100);
  }

  private addPane(group: IgcTabGroupPane, contentId: string, opts?: Object): boolean {
    let added = false;
    if (!this.findPane({id: contentId})) {
      group.panes.push(_.assign(opts || {}, {
        type: IgcDockManagerPaneType.contentPane,
        id: contentId,
        contentId: contentId
      }) as IgcContentPane);
      added = true;
    }
    if (_.has(group, 'panes')) {
      group.selectedIndex = _.findIndex(group.panes, {id: contentId});
    }
    return added;
  }

  private removePane(group: IgcTabGroupPane, contentId: string): boolean {
    let removed = false;
    if (this.findPane({id: contentId})) {
      const idx = _.findIndex(group.panes, {id: contentId});
      group.panes.splice(idx, 1);
      removed = true;
    }
    return removed;
  }
}
