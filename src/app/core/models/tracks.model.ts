import { ArtistModel } from "./artist.model";

export interface TrackModel {
    name: string;
    album: string;
    cover: string;
    url: string;
   
    _id: string | number;
    artist?: ArtistModel;
    duration?:Duration;
}

export interface Duration {
    start:string;
    end:string;
}