import { Component, Input, OnInit } from '@angular/core';
import { TrackModel } from '@core/models/tracks.model';
import { AppStateService } from '@core/store/app-state.service';

@Component({
    selector: 'app-card-player',
    templateUrl: './card-player.component.html',
    styleUrls: ['./card-player.component.css'],
    standalone: false
})
export class CardPlayerComponent implements OnInit {
  @Input() mode: 'small' | 'big' = 'small'
  @Input() track: TrackModel = { _id: 0, name: '', album: '', url: '', cover: '' };

  constructor(private appState: AppStateService) { }

  ngOnInit(): void {
  }

  sendPlay(track: TrackModel): void {
    this.appState.setCurrentTrack(track);
  }

}
