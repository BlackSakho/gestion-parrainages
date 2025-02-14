import { TestBed } from '@angular/core/testing';

import { ImportationElecteursService } from './importation-electeurs.service';

describe('ImportationElecteursService', () => {
  let service: ImportationElecteursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImportationElecteursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
