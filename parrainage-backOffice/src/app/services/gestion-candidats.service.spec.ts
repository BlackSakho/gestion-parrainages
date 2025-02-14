import { TestBed } from '@angular/core/testing';

import { GestionCandidatsService } from './gestion-candidats.service';

describe('GestionCandidatsService', () => {
  let service: GestionCandidatsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionCandidatsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
