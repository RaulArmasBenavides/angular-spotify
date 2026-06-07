import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppState, initialAppState, PlayerState, AuthState, SearchState } from './app.state';
import { TrackModel } from '../models/tracks.model';

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
