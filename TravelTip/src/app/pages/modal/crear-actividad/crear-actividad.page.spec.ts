import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearActividadPage } from './crear-actividad.page';

describe('CrearActividadPage', () => {
  let component: CrearActividadPage;
  let fixture: ComponentFixture<CrearActividadPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearActividadPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearActividadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
