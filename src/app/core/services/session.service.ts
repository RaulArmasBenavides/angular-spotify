import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AppStateService } from '@core/store/app-state.service';

/**
 * Datos de sesión del usuario. El login guarda USERNAME/USERID en localStorage
 * y el token en la cookie `token` (ver LoginPageComponent).
 */
@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly USERNAME_KEY = 'USERNAME';
  private readonly USERID_KEY = 'USERID';

  constructor(
    private cookie: CookieService,
    private router: Router,
    private appState: AppStateService
  ) { }

  getUsername(): string {
    return this.readStorage(this.USERNAME_KEY) ?? 'Usuario';
  }

  getUserId(): string {
    return this.readStorage(this.USERID_KEY) ?? '—';
  }

  logout(): void {
    try {
      this.cookie.delete('token', '/');
    } catch {
      // cookies no disponibles: seguimos limpiando el resto de la sesión
    }
    this.removeStorage(this.USERNAME_KEY);
    this.removeStorage(this.USERID_KEY);
    this.appState.logout();
    this.router.navigate(['/', 'auth']);
  }

  private readStorage(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  private removeStorage(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // localStorage no disponible
    }
  }
}
