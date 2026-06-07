import { TrackModel } from '@core/models/tracks.model';
import { Injectable } from '@angular/core';
import { AppStateService } from '@core/store/app-state.service';

@Injectable({
  providedIn: 'root'
})
export class MultimediaService {
  public trackInfo$ = this.appState.currentTrack$;
  public timeElapsed$ = this.appState.timeElapsed$;
  public timeRemaining$ = this.appState.timeRemaining$;
  public playerStatus$ = this.appState.isPlaying$;
  public playerPercentage$ = this.appState.playerPercentage$;
  public audio!: HTMLAudioElement;

  constructor(private appState: AppStateService) {
    this.audio = new Audio();
    this.trackInfo$.subscribe(track => {
      if (track) {
        this.setAudio(track);
      }
    });
    this.listenAllEvents();
  }

  private listenAllEvents(): void {

    this.audio.addEventListener('timeupdate', this.calculateTime, false)
    this.audio.addEventListener('playing', this.setPlayerStatus, false)
    this.audio.addEventListener('play', this.setPlayerStatus, false)
    this.audio.addEventListener('pause', this.setPlayerStatus, false)
    this.audio.addEventListener('ended', this.setPlayerStatus, false)

  }

  private setPlayerStatus = (state: any) => {
    switch (state.type) {
      case 'play':
      case 'playing':
        this.appState.setIsPlaying(true);
        break;
      case 'ended':
      case 'pause':
      default:
        this.appState.setIsPlaying(false);
        break;
    }
  }

  private calculateTime = () => {
    const { duration, currentTime } = this.audio;
    this.setTimeElapsed(currentTime);
    this.setRemaining(currentTime, duration);
    this.setPercentage(currentTime, duration);
  }

  private setPercentage(currentTime: number, duration: number): void {
    const percentage = (currentTime * 100) / duration;
    this.appState.setPlayerPercentage(percentage);
  }

  private setTimeElapsed(currentTime: number): void {
    const seconds = Math.floor(currentTime % 60);
    const minutes = Math.floor((currentTime / 60) % 60);
    const displaySeconds = (seconds < 10) ? `0${seconds}` : seconds;
    const displayMinutes = (minutes < 10) ? `0${minutes}` : minutes;
    const displayFormat = `${displayMinutes}:${displaySeconds}`;
    this.appState.setTimeElapsed(displayFormat);
  }

  private setRemaining(currentTime: number, duration: number): void {
    const timeLeft = duration - currentTime;
    const seconds = Math.floor(timeLeft % 60);
    const minutes = Math.floor((timeLeft / 60) % 60);
    const displaySeconds = (seconds < 10) ? `0${seconds}` : seconds;
    const displayMinutes = (minutes < 10) ? `0${minutes}` : minutes;
    const displayFormat = `-${displayMinutes}:${displaySeconds}`;
    this.appState.setTimeRemaining(displayFormat);
  }

  public setAudio(track: TrackModel): void {
    this.audio.src = track.url;
    this.audio.play();
  }

  public setVolume(volume: number): void {
    this.audio.volume = volume;
    this.appState.setVolume(volume);
  }

  public togglePlayer(): void {
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  public seekAudio(percentage: number): void {
    const { duration } = this.audio;
    const percentageToSecond = (percentage * duration) / 100;
    this.audio.currentTime = percentageToSecond;
  }

}
