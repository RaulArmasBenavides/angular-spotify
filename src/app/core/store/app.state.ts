import { TrackModel } from '../models/tracks.model';
import { ArtistModel } from '../models/artist.model';

export interface PlayerState {
  currentTrack: TrackModel | null;
  isPlaying: boolean;
  timeElapsed: string;
  timeRemaining: string;
  percentage: number;
  volume: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  username: string | null;
  token: string | null;
}

export interface SearchState {
  query: string;
  results: TrackModel[];
  history: string[];
}

export interface AppState {
  player: PlayerState;
  auth: AuthState;
  search: SearchState;
}

export const initialAppState: AppState = {
  player: {
    currentTrack: null,
    isPlaying: false,
    timeElapsed: '00:00',
    timeRemaining: '-00:00',
    percentage: 0,
    volume: 0.5,
  },
  auth: {
    isAuthenticated: false,
    userId: null,
    username: null,
    token: null,
  },
  search: {
    query: '',
    results: [],
    history: [],
  },
};
