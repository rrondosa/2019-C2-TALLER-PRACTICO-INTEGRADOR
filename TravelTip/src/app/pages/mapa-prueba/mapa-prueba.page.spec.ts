import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapaPruebaPage } from './mapa-prueba.page';

describe('MapaPruebaPage', () => {
  let component: MapaPruebaPage;
  let fixture: ComponentFixture<MapaPruebaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapaPruebaPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapaPruebaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
