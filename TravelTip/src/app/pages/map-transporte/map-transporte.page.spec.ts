import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapTransportePage } from './map-transporte.page';

describe('MapTransportePage', () => {
  let component: MapTransportePage;
  let fixture: ComponentFixture<MapTransportePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapTransportePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapTransportePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
