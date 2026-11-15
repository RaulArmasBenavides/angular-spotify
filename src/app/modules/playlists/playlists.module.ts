import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlaylistsRoutingModule } from './playlists-routing.module';
import { PlaylistPageComponent } from './pages/playlist-page/playlist-page.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    PlaylistPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    PlaylistsRoutingModule
  ]
})
export class PlaylistsModule { }
