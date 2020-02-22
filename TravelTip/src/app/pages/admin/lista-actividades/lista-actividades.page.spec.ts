import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaActividadesPage } from './lista-actividades.page';

describe('ListaActividadesPage', () => {
  let component: ListaActividadesPage;
  let fixture: ComponentFixture<ListaActividadesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaActividadesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaActividadesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
