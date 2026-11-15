import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TrackModel } from '@core/models/tracks.model';
import { SessionService } from '@core/services/session.service';
import { AppStateService } from '@core/store/app-state.service';

@Component({
    selector: 'app-favorite-page',
    templateUrl: './favorite-page.component.html',
    styleUrls: ['./favorite-page.component.css'],
    standalone: false
})
export class FavoritePageComponent {
  readonly liked$: Observable<TrackModel[]>;
  readonly username: string;

  constructor(
    private appState: AppStateService,
    private session: SessionService
  ) {
    this.liked$ = this.appState.likedTracks$;
    this.username = this.session.getUsername();
  }

  play(track: TrackModel): void {
    this.appState.setCurrentTrack(track);
  }

  playFirst(tracks: TrackModel[]): void {
    if (tracks.length > 0) {
      this.play(tracks[0]);
    }
  }

  unlike(track: TrackModel): void {
    this.appState.toggleLike(track);
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
