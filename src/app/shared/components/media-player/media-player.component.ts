import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppStateService } from '@core/store/app-state.service';
import { MultimediaService } from '@shared/services/multimedia.service';

@Component({
    selector: 'app-media-player',
    templateUrl: './media-player.component.html',
    styleUrls: ['./media-player.component.css'],
    standalone: false
})
export class MediaPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('progressBar') progressBar: ElementRef = new ElementRef('');
  @ViewChild('slider') slider!: ElementRef;

  maxVolume: number = 100;
  volume: number = 50;
  isDragging = false;
  LastVolumSelected: number = 0;

  get isPlaying$() {
    return this.appState.isPlaying$;
  }

  constructor(
    public multimediaService: MultimediaService,
    private appState: AppStateService
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  handlePosition(event: MouseEvent): void {
    const elNative: HTMLElement = this.progressBar.nativeElement;
    const { clientX } = event;
    const { x, width } = elNative.getBoundingClientRect();
    const clickX = clientX - x;
    const percentageFromX = (clickX * 100) / width;
    this.multimediaService.seekAudio(percentageFromX);
  }

  togglePlayer(): void {
    this.multimediaService.togglePlayer();
  }

  toggleVolume(): void {
    if (this.volume > 0) {
      this.LastVolumSelected = this.volume;
      this.volume = 0;
    } else {
      this.volume = this.LastVolumSelected;
    }
    this.setVolume(this.volume);
  }

  setVolume(newVolume: number): void {
    this.volume = newVolume;
    this.multimediaService.setVolume(this.volume / 100);
  }

  onBarClick(event: MouseEvent): void {
    const target = (event as MouseEvent).target;

    if ((target as Element).classList.contains('volume-slider')) {
      event.preventDefault();
      event.stopPropagation();

      let newVolume = this.calculateVolume(event);
      if (newVolume < 0) {
        newVolume = 0;
      } else if (newVolume > 100) {
        newVolume = 100;
      }
      this.volume = newVolume;
      this.setVolume(newVolume);
      return;
    }

    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const clickedPosition = event.clientX - rect.left;
    const width = rect.width;
    const newVolume = (clickedPosition / width) * 100;
    this.setVolume(newVolume);
  }

  onDragStart(event: MouseEvent | TouchEvent): void {
    this.isDragging = true;
  }

  onDragMove(event: MouseEvent | TouchEvent): void {
    if (!this.isDragging) return;

    let newVolume = this.calculateVolume(event);

    if (newVolume < 0) {
      newVolume = 0;
    } else if (newVolume > 100) {
      newVolume = 100;
    }

    this.volume = newVolume;
    this.setVolume(newVolume);
  }

  calculateVolume(event: MouseEvent | TouchEvent): number {
    event.preventDefault();
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const volumeBar = document.querySelector('.volume-bar') as HTMLElement;
    const { left, width } = volumeBar.getBoundingClientRect();
    const clickX = clientX - left;
    const volume = (clickX / width) * 100;

    return volume;
  }

  onDragEnd(event: MouseEvent | TouchEvent): void {
    const target = (event as MouseEvent).target || (event as TouchEvent).changedTouches[0].target;

    if ((target as Element).classList.contains('volume-slider')) {
      event.preventDefault();
      event.stopPropagation();

      let newVolume = this.calculateVolume(event);
      if (newVolume < 0) {
        newVolume = 0;
      } else if (newVolume > 100) {
        newVolume = 100;
      }
      this.volume = newVolume;
      this.setVolume(newVolume);
      return;
    }

    this.isDragging = false;
  }
}
