import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import * as mockRaw from '../../../data/user.json'
import { of } from 'rxjs';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppStateService } from '@core/store/app-state.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockUser: any = (mockRaw as any).default;
  let httpClientSpy: { post: jasmine.Spy }
  let appStateSpy: jasmine.SpyObj<AppStateService>;

  beforeEach(() => {
    const appStateSpyObj = jasmine.createSpyObj('AppStateService', ['setAuthenticated', 'logout']);

    TestBed.configureTestingModule({
    imports: [],
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClientTesting(),
      { provide: AppStateService, useValue: appStateSpyObj }
    ]
});
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post'])
    appStateSpy = appStateSpyObj;
    service = new AuthService(httpClientSpy as any, appStateSpy)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Debe de retornar un objecto con "data" y "tokenSession"',
    (done: DoneFn) => {

      const user: any = mockUser.userOk
      const mockResponse = {
        data: {},
        tokenSession: '0x0x0x',
        usuarioDB: { _id: '1', name: 'Test User' }
      }

      httpClientSpy.post.and.returnValue(
        of(mockResponse)
      )

      service.sendCredentials(user.email, user.password)
        .subscribe(responseApi => {
          const getProperties = Object.keys(responseApi)
          expect(getProperties).toContain('data')
          expect(getProperties).toContain('tokenSession')
          done()
        })

    })

});
