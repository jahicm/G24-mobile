import { TestBed } from '@angular/core/testing';

import { AnalyserService } from './analyser.service';

describe('AnalyserService', () => {
  let service: AnalyserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
