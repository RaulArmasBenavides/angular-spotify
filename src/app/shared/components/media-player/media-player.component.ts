import { Component, OnDestroy, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { TrackModel } from '@core/models/tracks.model';
import { MultimediaService } from '@shared/services/multimedia.service';
import { Subscription } from 'rxjs'; //TODO: Programacion reactiva!

@Component({
  selector: 'app-media-player',
  templateUrl: './media-player.component.html',
  styleUrls: ['./media-player.component.css']
})
export class MediaPlayerComponent implements OnInit, OnDestroy {
  @ViewChild('progressBar') progressBar: ElementRef = new ElementRef('')
  listObservers$: Array<Subscription> = []
  state: string = 'paused'
  constructor(public multimediaService: MultimediaService) { }
  @ViewChild('slider') slider!: ElementRef;
  maxVolume: number = 100;
  volume: number = 50;
  ngOnInit(): void {
    console.log("gaa");
    const observer1$ = this.multimediaService.playerStatus$
      .subscribe(status => this.state = status)
    this.listObservers$ = [observer1$]
  }

  ngOnDestroy(): void {
    this.listObservers$.forEach(u => u.unsubscribe())
    console.log('🔴🔴🔴🔴🔴🔴🔴 BOOM!');
  }


  handlePosition(event: MouseEvent): void {
    const elNative: HTMLElement = this.progressBar.nativeElement
    const { clientX } = event
    const { x, width } = elNative.getBoundingClientRect()
    const clickX = clientX - x //TODO: 1050 - x
    const percentageFromX = (clickX * 100) / width
    console.log(`Click(x): ${percentageFromX}`);
    this.multimediaService.seekAudio(percentageFromX)

  }


  togglePlayer(){
 
    this.multimediaService.togglePlayer();
  }

  setVolume(newVolume: number) {
    this.volume = newVolume;
    console.log(this.volume);
    this.multimediaService.setVolume(this.volume/100);
    // Aquí también implementarías la lógica para ajustar el volumen real del audio
    // this.isDragging = false;
  }

  onBarClick(event: MouseEvent): void {
    const target = (event as MouseEvent).target  ;

    // Si el target es el volume-slider, no hagas nada
    if ((target as Element).classList.contains('volume-slider')) {
      event.preventDefault();
      event.stopPropagation();
  
      let newVolume = this.calculateVolume(event);
      // Restringe el volumen a estar entre 0 y 100
      if (newVolume < 0) {
        newVolume = 0;
      } else if (newVolume > 100) {
        newVolume = 100;
      }
        // Asigna el nuevo volumen
    this.volume = newVolume;
    this.setVolume(newVolume);
      return;
    }
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const clickedPosition = event.clientX - rect.left; // Posición X del clic dentro del elemento
    const width = rect.width; // Ancho total de la barra de volumen
    const newVolume = (clickedPosition / width) * 100;
    this.setVolume(newVolume);
  }

  isDragging = false;

onDragStart(event: MouseEvent | TouchEvent): void {
 
  this.isDragging = true;
  // this.updateVolume(event);
}

onDragMove(event: MouseEvent | TouchEvent): void {
  if (!this.isDragging) return;

  let newVolume = this.calculateVolume(event);
 
  // Restringe el volumen a estar entre 0 y 100
  if (newVolume < 0) {
    newVolume = 0;
  } else if (newVolume > 100) {
    newVolume = 100;
  }

  // Asigna el nuevo volumen
  this.volume = newVolume;
  this.setVolume(newVolume);
  // if (this.isDragging) {
  //   // console.log(event);
  //   this.updateVolume(event);
  // }
}

private updateVolume(event: MouseEvent | TouchEvent): void {
  event.preventDefault(); // Previene comportamientos por defecto como el arrastre de imágenes o selección de texto
  const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  const volumeBar = document.querySelector('.volume-bar') as HTMLElement;
  const { left, width } = volumeBar.getBoundingClientRect();
  const clickX = clientX - left;
  const volume = (clickX / width) * 100;
    // this.isDragging = false;
   
}


calculateVolume(event: MouseEvent | TouchEvent): number {
  event.preventDefault(); // Previene comportamientos por defecto como el arrastre de imágenes o selección de texto
  const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
  const volumeBar = document.querySelector('.volume-bar') as HTMLElement;
  const { left, width } = volumeBar.getBoundingClientRect();
  const clickX = clientX - left;
  const volume = (clickX / width) * 100;
  
  return volume;
}
onDragEnd(event: MouseEvent | TouchEvent): void {

  const target = (event as MouseEvent).target || (event as TouchEvent).changedTouches[0].target;

  // Si el target es el volume-slider, no hagas nada
  if ((target as Element).classList.contains('volume-slider')) {
    event.preventDefault();
    event.stopPropagation();

    let newVolume = this.calculateVolume(event);
    // Restringe el volumen a estar entre 0 y 100
    if (newVolume < 0) {
      newVolume = 0;
    } else if (newVolume > 100) {
      newVolume = 100;
    }
      // Asigna el nuevo volumen
  this.volume = newVolume;
  this.setVolume(newVolume);
    return;
  }

  this.isDragging = false;

}

  // HostListeners para manejar eventos fuera del elemento, como cuando el usuario arrastra el mouse fuera de la barra de volumen
  // @HostListener('document:mouseup', ['$event'])
  // onDocumentMouseUp(event: MouseEvent): void {
  //   this.onDragEnd(event);
  // }

  // @HostListener('document:mousemove', ['$event'])
  // onDocumentMouseMove(event: MouseEvent): void {
  //   this.onDragMove(event);
  // }

  //  @HostListener('document:touchend', ['$event'])
  //  onDocumentTouchEnd(event: TouchEvent): void {
  //    this.onDragEnd(event);
  //  }

  //  @HostListener('document:touchmove', ['$event'])
  //  onDocumentTouchMove(event: TouchEvent): void {
  //    this.onDragMove(event);
  //  }
}
