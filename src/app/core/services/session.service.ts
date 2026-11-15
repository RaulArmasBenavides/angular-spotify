import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '@environments/environment';
import { AppStateService } from '@core/store/app-state.service';
import { LibraryService } from '@core/services/library.service';

interface UserProfile {
  id: string;
  name: string;
}

/**
 * Sesión del usuario. El token vive en la cookie `token`; el nombre y el ID
 * se piden a la API (GET /me/profile). No se guarda nada en localStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private readonly URL = `${environment.api}/me`;
  private profile: UserProfile = { id: '—', name: 'Usuario' };

  constructor(
    private cookie: CookieService,
    private router: Router,
    private http: HttpClient,
    private appState: AppStateService,
    private library: LibraryService
  ) { }

  getUsername(): string {
    return this.profile.name;
  }

  getUserId(): string {
    return this.profile.id;
  }

  /** Carga nombre e ID del usuario logueado. */
  loadProfile(): void {
    this.http.get<UserProfile>(`${this.URL}/profile`).subscribe({
      next: profile => this.profile = { id: profile.id, name: profile.name },
      error: () => { /* sin perfil se muestra "Usuario" */ }
    });
  }

  logout(): void {
    try {
      this.cookie.delete('token', '/');
    } catch {
      // cookies no disponibles: seguimos limpiando el resto de la sesión
    }
    this.profile = { id: '—', name: 'Usuario' };
    this.library.clear();
    this.appState.logout();
    this.router.navigate(['/', 'auth']);
  }
}
