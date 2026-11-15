import { Directive, HostListener, Input } from '@angular/core';
import { TrackModel } from '@core/models/tracks.model';
import { AppStateService } from '@core/store/app-state.service';

/**
 * Abre el menú contextual de una canción con clic derecho.
 * Uso: <li [appTrackMenu]="track">
 */
@Directive({
  selector: '[appTrackMenu]',
  standalone: false
})
export class TrackContextMenuDirective {
  @Input('appTrackMenu') track: TrackModel | null = null;

  constructor(private appState: AppStateService) { }

  @HostListener('contextmenu', ['$event'])
  onContextMenu(event: MouseEvent): void {
    if (!this.track) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    this.appState.openTrackMenu(this.track, event.clientX, event.clientY);
  }
}
