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
  currentTrack$: Observable<TrackModel | null> = new BehaviorSubject(null);
  isPlaying$: Observable<boolean> = new BehaviorSubject(false);
  timeElapsed$: Observable<string> = new BehaviorSubject('00:00');
  timeRemaining$: Observable<string> = new BehaviorSubject('-00:00');
  playerPercentage$: Observable<number> = new BehaviorSubject(0);
  volume$: Observable<number> = new BehaviorSubject(0.5);

  // Auth observables
  isAuthenticated$: Observable<boolean> = new BehaviorSubject(false);
  userId$: Observable<string | null> = new BehaviorSubject(null);
  username$: Observable<string | null> = new BehaviorSubject(null);

  // Search observables
  searchQuery$: Observable<string> = new BehaviorSubject('');
  searchResults$: Observable<TrackModel[]> = new BehaviorSubject([]);
  searchHistory$: Observable<string[]> = new BehaviorSubject([]);

  constructor() {
    this.initializeObservables();
  }

  private initializeObservables(): void {
    this.currentTrack$ = this.state$.asObservable().pipe(
      // map(state => state.player.currentTrack)
    );
  }

  // Player actions
  setCurrentTrack(track: TrackModel | null): void {
    const state = this.state$.value;
    this.state$.next({
      ...state,
      player: { ...state.player, currentTrack: track }
    });
    (this.currentTrack$ as BehaviorSubject<TrackModel | null>).next(track);
  }

  setIsPlaying(isPlaying: boolean): void {
    const state = this.state$.value;
    this.state$.next({
      ...state,
      player: { ...state.player, isPlaying }
    });
    (this.isPlaying$ as BehaviorSubject<boolean>).next(isPlaying);
  }

  setTimeElapsed(time: string): void {
    const state = this.state$.value;
    this.state$.next({
      ...state,
      player: { ...state.player, timeElapsed: time }
    });
    (this.timeElapsed$ as BehaviorSubject<string>).next(time);
  }

  setTimeRemaining(time: string): void {
    const state = this.state$.value;
    this.state$.next({
      ...state,
      player: { ...state.player, timeRemaining: time }
    });
    (this.timeRemaining$ as BehaviorSubject<string>).next(time);
  }

  setPlayerPercentage(percentage: number): void {
    const state = this.state$.value;
    this.state$.next({
      ...state,
      player: { ...state.player, percentage }
    });
    (this.playerPercentage$ as BehaviorSubject<number>).next(percentage);
  }

  setVolume(volume: number): void {
    const state = this.state$.value;
    this.state$.next({
      ...state,
      player: { ...state.player, volume }
    });
    (this.volume$ as BehaviorSubject<number>).next(volume);
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
    (this.isAuthenticated$ as BehaviorSubject<boolean>).next(isAuthenticated);
    (this.userId$ as BehaviorSubject<string | null>).next(userId || null);
    (this.username$ as BehaviorSubject<string | null>).next(username || null);
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
    (this.searchQuery$ as BehaviorSubject<string>).next(query);
  }

  setSearchResults(results: TrackModel[]): void {
    const state = this.state$.value;
    this.state$.next({
      ...state,
      search: { ...state.search, results }
    });
    (this.searchResults$ as BehaviorSubject<TrackModel[]>).next(results);
  }

  addToSearchHistory(query: string): void {
    const state = this.state$.value;
    const history = [query, ...state.search.history].slice(0, 10);
    this.state$.next({
      ...state,
      search: { ...state.search, history }
    });
    (this.searchHistory$ as BehaviorSubject<string[]>).next(history);
  }

  // Reset player state
  private resetPlayer(): void {
    const initialPlayer = initialAppState.player;
    (this.currentTrack$ as BehaviorSubject<TrackModel | null>).next(null);
    (this.isPlaying$ as BehaviorSubject<boolean>).next(false);
    (this.timeElapsed$ as BehaviorSubject<string>).next(initialPlayer.timeElapsed);
    (this.timeRemaining$ as BehaviorSubject<string>).next(initialPlayer.timeRemaining);
    (this.playerPercentage$ as BehaviorSubject<number>).next(0);
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
