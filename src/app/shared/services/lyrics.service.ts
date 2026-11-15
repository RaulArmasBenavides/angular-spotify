import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

/**
 * Obtiene letras desde lyrics.ovh (servicio público, sin clave).
 * Usa HttpBackend para saltarse InjectSessionInterceptor: el token de sesión
 * no debe enviarse a un servicio externo.
 */
@Injectable({
  providedIn: 'root'
})
export class LyricsService {
  private readonly http = new HttpClient(inject(HttpBackend));
  private readonly BASE_URL = 'https://api.lyrics.ovh/v1';
  private readonly cache = new Map<string, string | null>();

  getLyrics$(artist: string, title: string): Observable<string | null> {
    const cleanArtist = artist.trim();
    const cleanTitle = title.trim();
    if (!cleanArtist || !cleanTitle) {
      return of(null);
    }

    const key = `${cleanArtist}::${cleanTitle}`.toLowerCase();
    if (this.cache.has(key)) {
      return of(this.cache.get(key) ?? null);
    }

    const url = `${this.BASE_URL}/${encodeURIComponent(cleanArtist)}/${encodeURIComponent(cleanTitle)}`;
    return this.http.get<{ lyrics?: string }>(url).pipe(
      map(res => res.lyrics?.trim() || null),
      catchError(() => of(null)),
      tap(text => this.cache.set(key, text))
    );
  }
}
