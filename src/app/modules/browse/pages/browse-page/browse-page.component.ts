import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { TrackModel } from '@core/models/tracks.model';
import { AppStateService } from '@core/store/app-state.service';
import { TrackService } from '@modules/tracks/services/track.service';

export interface BrowseView {
  kind: 'artist' | 'album';
  name: string;
  artist: string;
  tracks: TrackModel[];
}

/**
 * Página de artista (/browse/artist/:name) o álbum (/browse/album/:name).
 * La API no tiene endpoints de artistas ni álbumes, así que filtramos las canciones.
 */
@Component({
    selector: 'app-browse-page',
    templateUrl: './browse-page.component.html',
    styleUrls: ['./browse-page.component.css'],
    standalone: false
})
export class BrowsePageComponent {
  readonly view$: Observable<BrowseView>;

  constructor(
    route: ActivatedRoute,
    trackService: TrackService,
    private appState: AppStateService
  ) {
    this.view$ = route.paramMap.pipe(
      switchMap(params => {
        const kind: 'artist' | 'album' = params.get('kind') === 'album' ? 'album' : 'artist';
        const name = params.get('name') ?? '';
        return trackService.getAllTracks$().pipe(
          map((all): BrowseView => {
            const tracks = (all ?? []).filter(t =>
              kind === 'artist' ? t.artist?.name === name : t.album === name
            );
            return { kind, name, artist: tracks[0]?.artist?.name ?? '', tracks };
          })
        );
      })
    );
  }

  play(track: TrackModel): void {
    this.appState.setCurrentTrack(track);
  }

  playFirst(tracks: TrackModel[]): void {
    if (tracks.length > 0) {
      this.play(tracks[0]);
    }
  }

  // La API devuelve la duración en segundos; mostramos m:ss
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
