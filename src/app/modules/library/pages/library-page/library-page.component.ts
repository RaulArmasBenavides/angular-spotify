import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlaylistDetail } from '@core/models/playlist.model';
import { AppStateService } from '@core/store/app-state.service';

@Component({
    selector: 'app-library-page',
    templateUrl: './library-page.component.html',
    styleUrls: ['./library-page.component.css'],
    standalone: false
})
export class LibraryPageComponent {
  readonly playlists$: Observable<PlaylistDetail[]>;
  filter: string = '';
  private readonly filterSubject$ = new BehaviorSubject<string>('');

  constructor(
    private appState: AppStateService,
    private router: Router
  ) {
    this.playlists$ = combineLatest([this.appState.playlists$, this.filterSubject$]).pipe(
      map(([playlists, filter]) => {
        const query = filter.trim().toLowerCase();
        return query ? playlists.filter(p => p.name.toLowerCase().includes(query)) : playlists;
      })
    );
  }

  onFilter(value: string): void {
    this.filter = value;
    this.filterSubject$.next(value);
  }

  createPlaylist(): void {
    const playlist = this.appState.createPlaylist();
    this.openPlaylist(playlist.id);
  }

  openPlaylist(id: string): void {
    this.router.navigate(['/', 'playlists', id]);
  }

  openFavorites(): void {
    this.router.navigate(['/', 'favorites']);
  }
}
