import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { StoreIncomesChartComponent } from './store-incomes-chart.component';
import { IgxCategoryChartModule } from 'igniteui-angular-charts';

describe('StoreIncomesChartComponent', () => {
  let component: StoreIncomesChartComponent;
  let fixture: ComponentFixture<StoreIncomesChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StoreIncomesChartComponent],
      imports: [FormsModule, IgxCategoryChartModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreIncomesChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
