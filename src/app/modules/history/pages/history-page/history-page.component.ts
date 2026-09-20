import { Component, OnInit } from '@angular/core';
import { TrackModel } from '@core/models/tracks.model';
import { SearchService } from '@modules/history/services/search.service';
import { Observable, of } from 'rxjs';

@Component({
    selector: 'app-history-page',
    templateUrl: './history-page.component.html',
    styleUrls: ['./history-page.component.css'],
    standalone: false
})
export class HistoryPageComponent implements OnInit {
  listResults$: Observable<any> = of(null)
  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
   
    this.listResults$ = this.searchService.searchTracks$('');
  }

  receiveData(event: string): void {
    this.listResults$ = this.searchService.searchTracks$(event)
  }
}
