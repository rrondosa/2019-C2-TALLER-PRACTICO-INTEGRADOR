import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapActividadPage } from './map-actividad.page';

describe('MapActividadPage', () => {
  let component: MapActividadPage;
  let fixture: ComponentFixture<MapActividadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapActividadPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapActividadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
