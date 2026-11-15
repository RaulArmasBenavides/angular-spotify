import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlaylistDetail } from '@core/models/playlist.model';
import { TrackModel } from '@core/models/tracks.model';
import { AppStateService } from '@core/store/app-state.service';
import { LibraryService } from '@core/services/library.service';
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
    private library: LibraryService,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.playlist$ = combineLatest([this.route.paramMap, this.library.playlists$]).pipe(
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
    this.library.addTrackToPlaylist(playlistId, track);
  }

  removeTrack(playlistId: string, trackId: string | number): void {
    this.library.removeTrackFromPlaylist(playlistId, trackId);
  }

  play(track: TrackModel): void {
    this.appState.setCurrentTrack(track);
  }

  coverError: string = '';

  onCoverSelected(playlistId: string, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || !file.type.startsWith('image/')) {
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      this.coverError = 'La imagen supera 8 MB.';
      return;
    }
    this.coverError = '';
    this.resizeToDataUrl(file)
      .then(dataUrl => this.library.setPlaylistCover(playlistId, dataUrl))
      .catch(() => this.coverError = 'No se pudo procesar la imagen.');
  }

  removeCover(playlistId: string): void {
    this.library.setPlaylistCover(playlistId, null);
  }

  // Recorta al centro y reduce a 320×320 para que la portada pese poco en MongoDB
  private resizeToDataUrl(file: File, size: number = 320): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        URL.revokeObjectURL(url);
        if (!ctx) {
          reject(new Error('canvas no disponible'));
          return;
        }
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('imagen inválida'));
      };
      img.src = url;
    });
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
