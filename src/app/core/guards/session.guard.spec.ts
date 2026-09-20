import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService } from 'ngx-cookie-service';

import { SessionGuard } from './session.guard';

describe('SessionGuard', () => {
  let guard: SessionGuard;
  let cookieService: jasmine.SpyObj<CookieService>;
  let router: Router;

  beforeEach(() => {
    const cookieServiceSpy = jasmine.createSpyObj('CookieService', ['check']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        SessionGuard,
        { provide: CookieService, useValue: cookieServiceSpy }
      ]
    });

    guard = TestBed.inject(SessionGuard);
    cookieService = TestBed.inject(CookieService) as jasmine.SpyObj<CookieService>;
    router = TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true when token cookie exists', () => {
    cookieService.check.and.returnValue(true);

    const result = guard.checkCookieSession();

    expect(result).toBe(true);
    expect(cookieService.check).toHaveBeenCalledWith('token');
  });

  it('should return false and navigate to auth when token cookie does not exist', () => {
    cookieService.check.and.returnValue(false);
    spyOn(router, 'navigate');

    const result = guard.checkCookieSession();

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/', 'auth']);
  });

  it('should return false when cookie check throws error', () => {
    cookieService.check.and.throwError('Cookie error');

    const result = guard.checkCookieSession();

    expect(result).toBe(false);
  });
});
