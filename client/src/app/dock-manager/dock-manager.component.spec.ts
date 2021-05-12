import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { DockManagerComponent } from './dock-manager.component';

import { defineCustomElements } from 'igniteui-dockmanager/loader';
defineCustomElements();

describe('DockManagerComponent', () => {
  let component: DockManagerComponent;
  let fixture: ComponentFixture<DockManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DockManagerComponent],
      imports: [CommonModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DockManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(document.querySelector('igc-dockmanager').constructor).toBe(customElements.get('igc-dockmanager'));
  });
});
