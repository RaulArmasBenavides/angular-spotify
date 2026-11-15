import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PlaylistDetail } from '@core/models/playlist.model';
import { LibraryService } from '@core/services/library.service';

@Component({
    selector: 'app-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.css'],
    standalone: false
})
export class SideBarComponent implements OnInit {

  mainMenu: {
    defaultOptions: Array<any>, accessLink: Array<any>
  } = { defaultOptions: [], accessLink: [] }

  playlists$: Observable<PlaylistDetail[]>;

  constructor(private router: Router,
    private library: LibraryService
  ) {
    this.playlists$ = this.library.playlists$;
  }

  ngOnInit(): void {
    this.mainMenu.defaultOptions = [
      {
        name: 'Home',
        icon: 'uil uil-estate',
        router: ['/', 'home']
      },
      {
        name: 'Buscar',
        icon: 'uil uil-search',
        router: ['/', 'history']
      },
      {
        name: 'Tu biblioteca',
        icon: 'uil uil-chart',
        router: ['/', 'library'],
      }
    ]

    this.mainMenu.accessLink = [
      {
        name: 'Crear lista',
        icon: 'uil-plus-square',
        action: () => this.createPlaylist()
      },
      {
        name: 'Canciones que te gustan',
        icon: 'uil-heart-medical',
        router: ['/', 'favorites'],
        query: { hola: 'mundo' }
      }
    ]
  }

  createPlaylist(): void {
    this.library.createPlaylist().subscribe(playlist => this.onSelectPlaylist(playlist.id));
  }

  onSelectPlaylist(playlistId: string): void {
    this.router.navigate(['/', 'playlists', playlistId]);
  }
}
