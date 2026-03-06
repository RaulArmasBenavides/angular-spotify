import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing'
import { TrackService } from './track.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TrackService', () => {
  let service: TrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(TrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
