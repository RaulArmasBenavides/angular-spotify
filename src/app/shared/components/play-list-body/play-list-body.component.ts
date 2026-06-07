import { Component, Input, OnInit } from '@angular/core';
import { TrackModel } from '@core/models/tracks.model';
import { AppStateService } from '@core/store/app-state.service';
import { MultimediaService } from '@shared/services/multimedia.service';

@Component({
    selector: 'app-play-list-body',
    templateUrl: './play-list-body.component.html',
    styleUrls: ['./play-list-body.component.css'],
    standalone: false
})
export class PlayListBodyComponent implements OnInit {
  @Input() tracks: TrackModel[] = [];
  optionSort: { property: string | null, order: string } = { property: null, order: 'asc' };
  currentPlayingId: number = 0;
  isalreadySelected: boolean = true;

  get isPlaying$() {
    return this.appState.isPlaying$;
  }

  constructor(
    public multimediaService: MultimediaService,
    private appState: AppStateService
  ) { }

  ngOnInit(): void {
  }

  changeSort(property: string): void {
    const { order } = this.optionSort;
    this.optionSort = {
      property,
      order: order === 'asc' ? 'desc' : 'asc'
    };
  }

  sendPlay(track: TrackModel): void {
    if (this.currentPlayingId === track._id) {
      this.multimediaService.togglePlayer();
    } else {
      this.currentPlayingId = Number(track._id);
      this.appState.setCurrentTrack(track);
    }
  }

}