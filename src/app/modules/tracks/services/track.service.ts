import { TrackModel } from '@core/models/tracks.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap, tap, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CustomPlaylist, PlaylistDetail } from '@core/models/playlist.model';
@Injectable({
  providedIn: 'root'
})
export class TrackService {
  private readonly URL = environment.api

  constructor(private http: HttpClient) {

  }

  /**
   * 
   * @returns Devolver todas las canciones
   */

  private skipById(listTracks: TrackModel[], id: number): Promise<TrackModel[]> {
    return new Promise((resolve, reject) => {
      const listTmp = listTracks.filter(a => a._id !== id)
      resolve(listTmp)
    })
  }

  /**
   * //TODO {data:[..1,...2,..2]}
   * 
   * @returns 
   */
  getAllTracks$(): Observable<any> {
    return this.http.get(`${this.URL}/tracks`)
      .pipe(
        map(({ data }: any) => {
          return data
        })
      )
  }


  /**
   * 
   * @returns Devolver canciones random
   */
  getAllRandom$(): Observable<any> {
    return this.http.get(`${this.URL}/tracks`)
      .pipe(
        mergeMap(({ data }: any) => this.skipById(data, 2)),
        // map((dataRevertida) => { //TODO aplicar un filter comun de array
        //   return dataRevertida.filter((track: TrackModel) => track._id !== 1)
        // })
        catchError((err) => {
          const { status, statusText } = err;
          return of([])
        })
      )
  }


  getCustomPlaylists(userId: string): Observable<CustomPlaylist[]> {
    return this.http.get<CustomPlaylist[]>(`${this.URL}/users/${userId}/customplaylists`);
  }

  getPlaylistDetail(playlistId: string): Observable<PlaylistDetail> {
    return this.http.get<PlaylistDetail>(`${this.URL}/playlists/${playlistId}`);
  }

 
}
