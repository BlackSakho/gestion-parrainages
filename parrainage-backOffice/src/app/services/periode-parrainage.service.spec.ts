import { TestBed } from '@angular/core/testing';

import { PeriodeParrainageService } from './periode-parrainage.service';

describe('PeriodeParrainageService', () => {
  let service: PeriodeParrainageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodeParrainageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
