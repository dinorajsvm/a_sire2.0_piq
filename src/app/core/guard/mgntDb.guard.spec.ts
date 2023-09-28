import { TestBed } from '@angular/core/testing';

import { ClusterJobsGuard } from './mgntDb.guard';

describe('ClusterJobsGuard', () => {
  let guard: ClusterJobsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ClusterJobsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
