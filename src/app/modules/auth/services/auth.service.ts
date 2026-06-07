import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AppStateService } from '@core/store/app-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly URL = environment.api;

  constructor(
    private readonly http: HttpClient,
    private appState: AppStateService
  ) { }

  sendCredentials(email: string, password: string): Observable<any> {
    const body = { email, password };
    return this.http.post(`${this.URL}/auth/login`, body).pipe(
      tap(response => this.handleLoginSuccess(response))
    );
  }

  private handleLoginSuccess(response: any): void {
    const { tokenSession, usuarioDB } = response;
    this.appState.setAuthenticated(
      true,
      usuarioDB._id,
      usuarioDB.name,
      tokenSession
    );
  }

  logout(): void {
    this.appState.logout();
  }
}
