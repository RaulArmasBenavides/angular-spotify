import { Component, Input, OnInit } from '@angular/core';
import { TrackModel } from '@core/models/tracks.model';
import { MultimediaService } from '@shared/services/multimedia.service';


@Component({
  selector: 'app-play-list-body',
  templateUrl: './play-list-body.component.html',
  styleUrls: ['./play-list-body.component.css']
})
export class PlayListBodyComponent implements OnInit {
  @Input() tracks: TrackModel[] = []
  optionSort: { property: string | null, order: string } = { property: null, order: 'asc' }
    // El ID del track actualmente en reproducción
    currentPlayingId:number=0;
    isalreadySelected: boolean = true;
  constructor(public multimediaService: MultimediaService) { }
  state: string = 'paused';
  ngOnInit(): void {
    const observer1$ = this.multimediaService.playerStatus$
    .subscribe(status => this.state = status)
  // this.listObservers$ = [observer1$]
  }

  changeSort(property: string): void {
    const { order } = this.optionSort
    this.optionSort = {
      property,
      order: order === 'asc' ? 'desc' : 'asc'
    }
    console.log(this.optionSort);
  }

  sendPlay(track: TrackModel): void {
    if (this.currentPlayingId === track._id) {
      // this.currentPlayingId = 0;
      // this.isalreadySelected = true;
    
      this.multimediaService.togglePlayer();
      // Añadir lógica de pausa aquí si es necesario
    } else {
      // this.isalreadySelected = false;
      this.currentPlayingId = Number(track._id);
      this.multimediaService.trackInfo$.next(track);
      // Añadir lógica de reproducción aquí si es necesario
    }

  }

}