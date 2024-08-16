import { TestBed } from '@angular/core/testing';

import { ToastIndicatorService } from './toast-indicator.service';

describe('ToastIndicatorService', () => {
  let service: ToastIndicatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastIndicatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
