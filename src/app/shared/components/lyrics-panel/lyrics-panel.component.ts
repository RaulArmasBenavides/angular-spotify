import { Component } from '@angular/core';
import { concat, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { TrackModel } from '@core/models/tracks.model';
import { AppStateService } from '@core/store/app-state.service';
import { LyricsService } from '@shared/services/lyrics.service';

export interface LyricsState {
  status: 'empty' | 'loading' | 'ok' | 'none';
  text?: string;
}

@Component({
    selector: 'app-lyrics-panel',
    templateUrl: './lyrics-panel.component.html',
    styleUrls: ['./lyrics-panel.component.css'],
    standalone: false
})
export class LyricsPanelComponent {
  readonly open$: Observable<boolean>;
  readonly track$: Observable<TrackModel | null>;
  readonly lyrics$: Observable<LyricsState>;

  constructor(
    private appState: AppStateService,
    private lyricsService: LyricsService
  ) {
    this.open$ = this.appState.lyricsOpen$;
    this.track$ = this.appState.currentTrack$;
    this.lyrics$ = this.appState.currentTrack$.pipe(
      switchMap((track): Observable<LyricsState> => {
        if (!track) {
          return of({ status: 'empty' });
        }
        return concat(
          of<LyricsState>({ status: 'loading' }),
          this.lyricsService.getLyrics$(track.artist?.name ?? '', track.name).pipe(
            map((text): LyricsState => (text ? { status: 'ok', text } : { status: 'none' })),
            catchError(() => of<LyricsState>({ status: 'none' }))
          )
        );
      })
    );
  }

  close(): void {
    this.appState.setLyricsOpen(false);
  }
}
