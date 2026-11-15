import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlaylistDetail } from '@core/models/playlist.model';
import { TrackModel } from '@core/models/tracks.model';
import { AppStateService } from '@core/store/app-state.service';
import { SearchService } from '@modules/history/services/search.service';

@Component({
    selector: 'app-playlist-page',
    templateUrl: './playlist-page.component.html',
    styleUrls: ['./playlist-page.component.css'],
    standalone: false
})
export class PlaylistPageComponent implements OnInit {
  playlist$: Observable<PlaylistDetail | undefined> = of(undefined);
  searchTerm: string = '';
  searchResults$: Observable<TrackModel[]> = of([]);

  constructor(
    private route: ActivatedRoute,
    private appState: AppStateService,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.playlist$ = combineLatest([this.route.paramMap, this.appState.playlists$]).pipe(
      map(([params, playlists]) => playlists.find(p => p.id === params.get('id')))
    );
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    const clean = term.trim();
    this.searchResults$ = clean.length >= 3
      ? this.searchService.searchTracks$(clean)
      : of([]);
  }

  addTrack(playlistId: string, track: TrackModel): void {
    this.appState.addTrackToPlaylist(playlistId, track);
  }

  removeTrack(playlistId: string, trackId: string | number): void {
    this.appState.removeTrackFromPlaylist(playlistId, trackId);
  }

  play(track: TrackModel): void {
    this.appState.setCurrentTrack(track);
  }

  // La API devuelve la duración en segundos; mostramos m:ss como Spotify
  formatDuration(seconds: unknown): string {
    const total = Number(seconds);
    if (!Number.isFinite(total) || total < 0) {
      return '';
    }
    const m = Math.floor(total / 60);
    const s = Math.floor(total % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
}
