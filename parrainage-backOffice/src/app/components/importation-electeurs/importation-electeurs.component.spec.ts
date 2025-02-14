import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportationElecteursComponent } from './importation-electeurs.component';

describe('ImportationElecteursComponent', () => {
  let component: ImportationElecteursComponent;
  let fixture: ComponentFixture<ImportationElecteursComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportationElecteursComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportationElecteursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
