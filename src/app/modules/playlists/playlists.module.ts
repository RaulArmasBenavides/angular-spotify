import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlaylistsRoutingModule } from './playlists-routing.module';
import { PlaylistPageComponent } from './pages/playlist-page/playlist-page.component';


@NgModule({
  declarations: [
    PlaylistPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PlaylistsRoutingModule
  ]
})
export class PlaylistsModule { }
