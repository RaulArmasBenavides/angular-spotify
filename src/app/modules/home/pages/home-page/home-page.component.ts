import { Component, OnInit } from '@angular/core';
import { LibraryService } from '@core/services/library.service';
import { SessionService } from '@core/services/session.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.css'],
    standalone: false
})
export class HomePageComponent implements OnInit {

  constructor(
    private library: LibraryService,
    private session: SessionService
  ) { }

  // Solo se llega aquí con sesión: cargamos perfil, playlists y me gusta
  ngOnInit(): void {
    this.session.loadProfile();
    this.library.load();
  }

}
