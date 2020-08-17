import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
//import { DockManagerModule } from './dock-manager/dock-manager.module';
import { DockManagerComponent } from './dock-manager/dock-manager.component';
import { RevealComponent } from './reveal/reveal.component';
import { StoresGridComponent } from './stores-grid/stores-grid.component';
import { IgxGridModule } from '@infragistics/igniteui-angular';
import { StoreIncomesChartComponent } from './store-incomes-chart/store-incomes-chart.component';
import { IgxDataChartCoreModule } from 'igniteui-angular-charts';
import { IgxDataChartCategoryModule } from 'igniteui-angular-charts';
import { IgxDataChartStackedModule } from 'igniteui-angular-charts';
import { IgxDataChartInteractivityModule } from 'igniteui-angular-charts';
import { IgxLegendModule } from 'igniteui-angular-charts';

import { SampleDataService } from './sample-data.service';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { defineCustomElements } from '@infragistics/igniteui-dockmanager/loader';
defineCustomElements();

@NgModule({
  declarations: [
    AppComponent,
    DockManagerComponent,
    HomeComponent,
    StoreIncomesChartComponent,
    RevealComponent,
    StoresGridComponent,
  ],
  imports: [
    BrowserModule,
    HammerModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    IgxGridModule,
		IgxDataChartCoreModule,
    IgxDataChartCategoryModule,
    IgxDataChartStackedModule,
		IgxDataChartInteractivityModule,
		IgxLegendModule
  ],
  providers: [SampleDataService],
  bootstrap: [AppComponent],
  entryComponents: [StoresGridComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
