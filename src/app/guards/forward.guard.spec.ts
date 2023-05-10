import { TestBed, async, inject } from '@angular/core/testing';

import { ForwardGuard } from './forward.guard';

describe('ForwardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ForwardGuard]
    });
  });

  it('should ...', inject([ForwardGuard], (guard: ForwardGuard) => {
    expect(guard).toBeTruthy();
  }));
});
