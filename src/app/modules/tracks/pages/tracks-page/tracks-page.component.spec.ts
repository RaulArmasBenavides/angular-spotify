import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracksPageComponent } from './tracks-page.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TracksPageComponent', () => {
  let component: TracksPageComponent;
  let fixture: ComponentFixture<TracksPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    declarations: [TracksPageComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TracksPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
