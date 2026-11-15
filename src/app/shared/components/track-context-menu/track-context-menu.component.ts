import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PlaylistDetail } from '@core/models/playlist.model';
import { TrackModel } from '@core/models/tracks.model';
import { AppStateService } from '@core/store/app-state.service';
import { LibraryService } from '@core/services/library.service';

interface TrackMenuState {
  x: number;
  y: number;
  track: TrackModel;
}

@Component({
    selector: 'app-track-context-menu',
    templateUrl: './track-context-menu.component.html',
    styleUrls: ['./track-context-menu.component.css'],
    standalone: false
})
export class TrackContextMenuComponent {
  readonly menu$: Observable<TrackMenuState | null>;
  readonly playlists$: Observable<PlaylistDetail[]>;

  private readonly MENU_WIDTH = 240;
  private readonly MENU_HEIGHT = 360;

  constructor(
    private appState: AppStateService,
    private library: LibraryService,
    private router: Router
  ) {
    this.menu$ = this.appState.trackMenu$;
    this.playlists$ = this.library.playlists$;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close();
  }

  close(): void {
    this.appState.closeTrackMenu();
  }

  // Evita que el menú se salga de la pantalla
  posX(x: number): number {
    return Math.max(8, Math.min(x, window.innerWidth - this.MENU_WIDTH - 8));
  }

  posY(y: number): number {
    return Math.max(8, Math.min(y, window.innerHeight - this.MENU_HEIGHT - 8));
  }

  isLiked(track: TrackModel): boolean {
    return this.library.isLiked(track._id);
  }

  play(track: TrackModel): void {
    this.appState.setCurrentTrack(track);
    this.close();
  }

  toggleLike(track: TrackModel): void {
    this.library.toggleLike(track);
    this.close();
  }

  goToArtist(track: TrackModel): void {
    const name = track.artist?.name;
    this.close();
    if (name) {
      this.router.navigate(['/', 'browse', 'artist', name]);
    }
  }

  goToAlbum(track: TrackModel): void {
    const album = track.album;
    this.close();
    if (album) {
      this.router.navigate(['/', 'browse', 'album', album]);
    }
  }

  addToPlaylist(playlist: PlaylistDetail, track: TrackModel): void {
    this.library.addTrackToPlaylist(playlist.id, track);
    this.close();
  }
}
