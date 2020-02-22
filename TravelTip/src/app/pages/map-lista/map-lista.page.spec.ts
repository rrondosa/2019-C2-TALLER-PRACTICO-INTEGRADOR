import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapListaPage } from './map-lista.page';

describe('MapListaPage', () => {
  let component: MapListaPage;
  let fixture: ComponentFixture<MapListaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapListaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapListaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
