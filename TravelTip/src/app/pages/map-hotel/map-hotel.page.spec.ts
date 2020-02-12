import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapHotelPage } from './map-hotel.page';

describe('MapHotelPage', () => {
  let component: MapHotelPage;
  let fixture: ComponentFixture<MapHotelPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapHotelPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapHotelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
