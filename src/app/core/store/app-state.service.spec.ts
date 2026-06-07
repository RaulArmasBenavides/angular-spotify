import { TestBed } from '@angular/core/testing';
import { AppStateService } from './app-state.service';
import { TrackModel } from '../models/tracks.model';

describe('AppStateService', () => {
  let service: AppStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Player State', () => {
    it('should set current track', (done) => {
      const mockTrack: TrackModel = {
        id: '1',
        name: 'Test Song',
        artists: [],
        url: 'http://example.com/song.mp3'
      };

      service.setCurrentTrack(mockTrack);
      service.currentTrack$.subscribe(track => {
        expect(track).toEqual(mockTrack);
        done();
      });
    });

    it('should set playing status', (done) => {
      service.setIsPlaying(true);
      service.isPlaying$.subscribe(isPlaying => {
        expect(isPlaying).toBe(true);
        done();
      });
    });

    it('should set player percentage', (done) => {
      service.setPlayerPercentage(50);
      service.playerPercentage$.subscribe(percentage => {
        expect(percentage).toBe(50);
        done();
      });
    });
  });

  describe('Auth State', () => {
    it('should set authenticated state', (done) => {
      service.setAuthenticated(true, 'user123', 'testuser', 'token123');
      service.isAuthenticated$.subscribe(isAuth => {
        expect(isAuth).toBe(true);
        done();
      });
    });

    it('should reset state on logout', (done) => {
      service.logout();
      service.isAuthenticated$.subscribe(isAuth => {
        expect(isAuth).toBe(false);
        done();
      });
    });
  });

  describe('Search State', () => {
    it('should set search query', (done) => {
      service.setSearchQuery('test query');
      service.searchQuery$.subscribe(query => {
        expect(query).toBe('test query');
        done();
      });
    });

    it('should add to search history', (done) => {
      service.addToSearchHistory('query1');
      service.addToSearchHistory('query2');
      service.searchHistory$.subscribe(history => {
        expect(history.length).toBe(2);
        expect(history[0]).toBe('query2');
        done();
      });
    });
  });

  describe('State Getters', () => {
    it('should return current app state', () => {
      const state = service.getState();
      expect(state.player).toBeDefined();
      expect(state.auth).toBeDefined();
      expect(state.search).toBeDefined();
    });

    it('should return player state', () => {
      const playerState = service.getPlayerState();
      expect(playerState.currentTrack).toBeNull();
      expect(playerState.isPlaying).toBe(false);
    });
  });
});
