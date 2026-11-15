import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { PlaylistDetail } from '@core/models/playlist.model';
import { TrackModel } from '@core/models/tracks.model';

/**
 * Biblioteca del usuario (playlists y "me gusta") guardada en la API / PostgreSQL.
 * Mantiene una copia en memoria para que la interfaz responda al instante.
 */
@Injectable({
  providedIn: 'root'
})
export class LibraryService {
  private readonly URL = `${environment.api}/me`;

  private playlistsSubject$ = new BehaviorSubject<PlaylistDetail[]>([]);
  playlists$: Observable<PlaylistDetail[]> = this.playlistsSubject$.asObservable();

  private likedSubject$ = new BehaviorSubject<TrackModel[]>([]);
  likedTracks$: Observable<TrackModel[]> = this.likedSubject$.asObservable();

  constructor(private http: HttpClient) { }

  /** Carga playlists y me gusta del usuario logueado. */
  load(): void {
    this.refreshPlaylists();
    this.refreshLikes();
  }

  /** Vacía la copia en memoria (al cerrar sesión). */
  clear(): void {
    this.playlistsSubject$.next([]);
    this.likedSubject$.next([]);
  }

  // ===== Me gusta =====

  isLiked(trackId: string | number): boolean {
    return this.likedSubject$.value.some(t => String(t._id) === String(trackId));
  }

  toggleLike(track: TrackModel): void {
    const id = String(track._id);
    const current = this.likedSubject$.value;

    if (this.isLiked(id)) {
      this.likedSubject$.next(current.filter(t => String(t._id) !== id));
      this.http.delete(`${this.URL}/likes/${id}`).subscribe({ error: () => this.refreshLikes() });
    } else {
      this.likedSubject$.next([...current, track]);
      this.http.put(`${this.URL}/likes/${id}`, { track }).subscribe({ error: () => this.refreshLikes() });
    }
  }

  private refreshLikes(): void {
    this.http.get<{ data: TrackModel[] }>(`${this.URL}/likes`)
      .subscribe(res => this.likedSubject$.next(res.data));
  }

  // ===== Playlists =====

  createPlaylist(name?: string): Observable<PlaylistDetail> {
    return this.http.post<{ data: PlaylistDetail }>(`${this.URL}/playlists`, { name }).pipe(
      map(res => res.data),
      tap(playlist => this.playlistsSubject$.next([...this.playlistsSubject$.value, playlist]))
    );
  }

  addTrackToPlaylist(playlistId: string, track: TrackModel): void {
    const key = String(track._id);
    this.updateLocal(playlistId, p =>
      p.tracks.some(t => String(t._id) === key) ? p.tracks : [...p.tracks, track]
    );
    this.http.post(`${this.URL}/playlists/${playlistId}/tracks`, { track })
      .subscribe({ error: () => this.refreshPlaylists() });
  }

  removeTrackFromPlaylist(playlistId: string, trackId: string | number): void {
    const key = String(trackId);
    this.updateLocal(playlistId, p => p.tracks.filter(t => String(t._id) !== key));
    this.http.delete(`${this.URL}/playlists/${playlistId}/tracks/${key}`)
      .subscribe({ error: () => this.refreshPlaylists() });
  }

  setPlaylistCover(playlistId: string, cover: string | null): void {
    this.playlistsSubject$.next(
      this.playlistsSubject$.value.map(p => (p.id === playlistId ? { ...p, cover: cover ?? undefined } : p))
    );
    this.http.patch(`${this.URL}/playlists/${playlistId}`, { cover })
      .subscribe({ error: () => this.refreshPlaylists() });
  }

  /** Restaura las 4 listas por defecto y borra las demás. */
  resetPlaylists(): Observable<PlaylistDetail[]> {
    return this.http.post<{ data: PlaylistDetail[] }>(`${this.URL}/playlists/reset`, {}).pipe(
      map(res => res.data),
      tap(playlists => this.playlistsSubject$.next(playlists))
    );
  }

  private updateLocal(playlistId: string, change: (p: PlaylistDetail) => TrackModel[]): void {
    this.playlistsSubject$.next(
      this.playlistsSubject$.value.map(p => (p.id === playlistId ? { ...p, tracks: change(p) } : p))
    );
  }

  private refreshPlaylists(): void {
    this.http.get<{ data: PlaylistDetail[] }>(`${this.URL}/playlists`)
      .subscribe(res => this.playlistsSubject$.next(res.data));
  }
}
