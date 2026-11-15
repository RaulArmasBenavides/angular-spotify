import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppState, initialAppState, PlayerState, AuthState, SearchState } from './app.state';
import { TrackModel } from '../models/tracks.model';
import { PlaylistDetail } from '../models/playlist.model';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private state$ = new BehaviorSubject<AppState>(initialAppState);

  // Player observables
  private currentTrackSubject$ = new BehaviorSubject<TrackModel | null>(null);
  currentTrack$: Observable<TrackModel | null> = this.currentTrackSubject$.asObservable();

  private isPlayingSubject$ = new BehaviorSubject<boolean>(false);
  isPlaying$: Observable<boolean> = this.isPlayingSubject$.asObservable();

  private timeElapsedSubject$ = new BehaviorSubject<string>('00:00');
  timeElapsed$: Observable<string> = this.timeElapsedSubject$.asObservable();

  private timeRemainingSubject$ = new BehaviorSubject<string>('-00:00');
  timeRemaining$: Observable<string> = this.timeRemainingSubject$.asObservable();

  private playerPercentageSubject$ = new BehaviorSubject<number>(0);
  playerPercentage$: Observable<number> = this.playerPercentageSubject$.asObservable();

  private volumeSubject$ = new BehaviorSubject<number>(0.5);
  volume$: Observable<number> = this.volumeSubject$.asObservable();

  // Auth observables
  private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
  isAuthenticated$: Observable<boolean> = this.isAuthenticatedSubject$.asObservable();

  private userIdSubject$ = new BehaviorSubject<string | null>(null);
  userId$: Observable<string | null> = this.userIdSubject$.asObservable();

  private usernameSubject$ = new BehaviorSubject<string | null>(null);
  username$: Observable<string | null> = this.usernameSubject$.asObservable();

  // Search observables
  private searchQuerySubject$ = new BehaviorSubject<string>('');
  searchQuery$: Observable<string> = this.searchQuerySubject$.asObservable();

  private searchResultsSubject$ = new BehaviorSubject<TrackModel[]>([]);
  searchResults$: Observable<TrackModel[]> = this.searchResultsSubject$.asObservable();

  private searchHistorySubject$ = new BehaviorSubject<string[]>([]);
  searchHistory$: Observable<string[]> = this.searchHistorySubject$.asObservable();

  // Playlists: se guardan en localStorage porque la API aún no tiene endpoints de playlists
  // Datos por usuario (playlists y me gusta) guardados en localStorage
  private currentUserId: string | null = this.readStoredUserId();
  private playlistsSubject$ = new BehaviorSubject<PlaylistDetail[]>(this.loadPlaylists());
  playlists$: Observable<PlaylistDetail[]> = this.playlistsSubject$.asObservable();

  private likedSubject$ = new BehaviorSubject<TrackModel[]>(this.loadLiked());
  likedTracks$: Observable<TrackModel[]> = this.likedSubject$.asObservable();

  // Panel de letras (abierto/cerrado)
  private lyricsOpenSubject$ = new BehaviorSubject<boolean>(false);
  lyricsOpen$: Observable<boolean> = this.lyricsOpenSubject$.asObservable();

  constructor() {
  }

  // Player actions
  setCurrentTrack(track: TrackModel | null): void {
    const state = this.state$.value;
    this.state$.next({
      ...state,
      player: { ...state.player, currentTrack: track }
    });
    this.currentTrackSubject$.next(track);
  }

  setIsPlaying(isPlaying: boolean): void {
    const state = this.state$.value;
    this.state$.next({
      ...state,
      player: { ...state.player, isPlaying }
    });
    this.isPlayingSubject$.next(isPlaying);
  }

  setTimeElapsed(time: string): void {
    const state = this.state$.value;
    this.state$.next({
      ...state,
      player: { ...state.player, timeElapsed: time }
    });
    this.timeElapsedSubject$.next(time);
  }

  setTimeRemaining(time: string): void {
    const state = this.state$.value;
    this.state$.next({
      ...state,
      player: { ...state.player, timeRemaining: time }
    });
    this.timeRemainingSubject$.next(time);
  }

  setPlayerPercentage(percentage: number): void {
    const state = this.state$.value;
    this.state$.next({
      ...state,
      player: { ...state.player, percentage }
    });
    this.playerPercentageSubject$.next(percentage);
  }

  setVolume(volume: number): void {
    const state = this.state$.value;
    this.state$.next({
      ...state,
      player: { ...state.player, volume }
    });
    this.volumeSubject$.next(volume);
  }

  // Auth actions
  setAuthenticated(isAuthenticated: boolean, userId?: string, username?: string, token?: string): void {
    this.switchUser(isAuthenticated ? userId ?? null : null);
    const state = this.state$.value;
    this.state$.next({
      ...state,
      auth: {
        isAuthenticated,
        userId: userId || null,
        username: username || null,
        token: token || null
      }
    });
    this.isAuthenticatedSubject$.next(isAuthenticated);
    this.userIdSubject$.next(userId || null);
    this.usernameSubject$.next(username || null);
  }

  logout(): void {
    this.setAuthenticated(false);
    this.resetPlayer();
  }

  // Search actions
  setSearchQuery(query: string): void {
    const state = this.state$.value;
    this.state$.next({
      ...state,
      search: { ...state.search, query }
    });
    this.searchQuerySubject$.next(query);
  }

  setSearchResults(results: TrackModel[]): void {
    const state = this.state$.value;
    this.state$.next({
      ...state,
      search: { ...state.search, results }
    });
    this.searchResultsSubject$.next(results);
  }

  addToSearchHistory(query: string): void {
    const state = this.state$.value;
    const history = [query, ...state.search.history].slice(0, 10);
    this.state$.next({
      ...state,
      search: { ...state.search, history }
    });
    this.searchHistorySubject$.next(history);
  }

  // Usuario: cada usuario tiene sus propias listas y me gusta
  private readStoredUserId(): string | null {
    try {
      return localStorage.getItem('USERID');
    } catch {
      return null;
    }
  }

  private switchUser(userId: string | null): void {
    if (userId === this.currentUserId) {
      return;
    }
    this.currentUserId = userId;
    this.playlistsSubject$.next(this.loadPlaylists());
    this.likedSubject$.next(this.loadLiked());
  }

  private playlistsKey(): string {
    return `spotify.playlists.${this.currentUserId ?? 'anon'}`;
  }

  private likedKey(): string {
    return `spotify.liked.${this.currentUserId ?? 'anon'}`;
  }

  // Me gusta
  isLiked(trackId: string | number): boolean {
    return this.likedSubject$.value.some(t => String(t._id) === String(trackId));
  }

  toggleLike(track: TrackModel): void {
    const current = this.likedSubject$.value;
    const id = String(track._id);
    const next = current.some(t => String(t._id) === id)
      ? current.filter(t => String(t._id) !== id)
      : [...current, track];
    this.likedSubject$.next(next);
    try {
      localStorage.setItem(this.likedKey(), JSON.stringify(next));
    } catch {
      // localStorage no disponible: el me gusta sigue en memoria
    }
  }

  private loadLiked(): TrackModel[] {
    try {
      const raw = localStorage.getItem(this.likedKey());
      if (raw) {
        return JSON.parse(raw) as TrackModel[];
      }
    } catch {
      // JSON inválido o localStorage no disponible
    }
    return [];
  }

  // Lyrics actions
  setLyricsOpen(open: boolean): void {
    this.lyricsOpenSubject$.next(open);
  }

  toggleLyrics(): void {
    this.setLyricsOpen(!this.lyricsOpenSubject$.value);
  }

  // Playlist actions
  createPlaylist(name?: string): PlaylistDetail {
    const current = this.playlistsSubject$.value;
    const playlist: PlaylistDetail = {
      id: `lista-${Date.now().toString(36)}`,
      name: name?.trim() || `Mi lista nº${current.length + 1}`,
      tracks: []
    };
    this.setPlaylists([...current, playlist]);
    return playlist;
  }

  getPlaylist(id: string): PlaylistDetail | undefined {
    return this.playlistsSubject$.value.find(p => p.id === id);
  }

  addTrackToPlaylist(playlistId: string, track: TrackModel): void {
    this.updatePlaylist(playlistId, p =>
      p.tracks.some(t => String(t._id) === String(track._id)) ? p.tracks : [...p.tracks, track]
    );
  }

  removeTrackFromPlaylist(playlistId: string, trackId: string | number): void {
    this.updatePlaylist(playlistId, p => p.tracks.filter(t => String(t._id) !== String(trackId)));
  }

  private updatePlaylist(playlistId: string, change: (p: PlaylistDetail) => TrackModel[]): void {
    this.setPlaylists(
      this.playlistsSubject$.value.map(p => (p.id === playlistId ? { ...p, tracks: change(p) } : p))
    );
  }

  resetPlaylists(): void {
    this.setPlaylists(this.defaultPlaylists());
  }

  private setPlaylists(playlists: PlaylistDetail[]): void {
    this.playlistsSubject$.next(playlists);
    try {
      localStorage.setItem(this.playlistsKey(), JSON.stringify(playlists));
    } catch {
      // localStorage no disponible (modo privado, cookies bloqueadas): la lista sigue en memoria
    }
  }

  private loadPlaylists(): PlaylistDetail[] {
    try {
      const raw = localStorage.getItem(this.playlistsKey());
      if (raw) {
        return JSON.parse(raw) as PlaylistDetail[];
      }
    } catch {
      // JSON inválido o localStorage no disponible: usamos las listas por defecto
    }
    return this.defaultPlaylists();
  }

  private defaultPlaylists(): PlaylistDetail[] {
    return [1, 2, 3, 4].map(n => ({ id: `mi-lista-${n}`, name: `Mi lista º${n}`, tracks: [] }));
  }

  // Reset player state
  private resetPlayer(): void {
    const initialPlayer = initialAppState.player;
    this.currentTrackSubject$.next(null);
    this.isPlayingSubject$.next(false);
    this.timeElapsedSubject$.next(initialPlayer.timeElapsed);
    this.timeRemainingSubject$.next(initialPlayer.timeRemaining);
    this.playerPercentageSubject$.next(0);
  }

  // Getters for current state
  getState(): AppState {
    return this.state$.value;
  }

  getPlayerState(): PlayerState {
    return this.state$.value.player;
  }

  getAuthState(): AuthState {
    return this.state$.value.auth;
  }

  getSearchState(): SearchState {
    return this.state$.value.search;
  }
}
