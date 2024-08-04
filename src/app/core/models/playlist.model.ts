import { TrackModel } from "./tracks.model";

export interface CustomPlaylist {
    name: string;
    router: string[];
  }


  export interface PlaylistDetail {
    id: string;
    name: string;
    tracks: TrackModel[];
  }