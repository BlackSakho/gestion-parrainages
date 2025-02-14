import { TestBed } from '@angular/core/testing';

import { ElecteursService } from './electeurs.service';

describe('ElecteursService', () => {
  let service: ElecteursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElecteursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
