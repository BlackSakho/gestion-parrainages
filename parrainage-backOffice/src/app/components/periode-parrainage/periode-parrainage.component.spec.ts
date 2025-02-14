import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodeParrainageComponent } from './periode-parrainage.component';

describe('PeriodeParrainageComponent', () => {
  let component: PeriodeParrainageComponent;
  let fixture: ComponentFixture<PeriodeParrainageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeriodeParrainageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeriodeParrainageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
