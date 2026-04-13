import { TestBed } from '@angular/core/testing';

import { Otpservice } from './otpservice';

describe('Otpservice', () => {
  let service: Otpservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Otpservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
