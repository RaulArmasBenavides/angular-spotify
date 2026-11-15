import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryService } from '@core/services/library.service';
import { SessionService } from '@core/services/session.service';

import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let library: jasmine.SpyObj<LibraryService>;
  let session: jasmine.SpyObj<SessionService>;

  beforeEach(async () => {
    // Dobles de prueba: evitan peticiones reales a la API desde ngOnInit
    library = jasmine.createSpyObj<LibraryService>('LibraryService', ['load']);
    session = jasmine.createSpyObj<SessionService>('SessionService', ['loadProfile']);

    await TestBed.configureTestingModule({
      declarations: [ HomePageComponent ],
      providers: [
        { provide: LibraryService, useValue: library },
        { provide: SessionService, useValue: session }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load profile and library on init', () => {
    expect(session.loadProfile).toHaveBeenCalled();
    expect(library.load).toHaveBeenCalled();
  });
});
