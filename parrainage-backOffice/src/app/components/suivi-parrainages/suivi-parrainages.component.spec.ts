import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviParrainagesComponent } from './suivi-parrainages.component';

describe('SuiviParrainagesComponent', () => {
  let component: SuiviParrainagesComponent;
  let fixture: ComponentFixture<SuiviParrainagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiviParrainagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuiviParrainagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
