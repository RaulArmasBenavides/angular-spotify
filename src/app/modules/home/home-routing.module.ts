import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Page404Component } from './error/page404/page404.component';


const routes: Routes = [
 
  {
    path: 'tracks',
    loadChildren: () => import('@modules/tracks/tracks.module').then(m => m.TracksModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import('@modules/favorites/favorites.module').then(m => m.FavoritesModule)
  },
  {
    path: 'history',
    loadChildren: () => import('@modules/history/history.module').then(m => m.HistoryModule)
  },
  {
    path: 'library',
    loadChildren: () => import('@modules/library/library.module').then(m => m.LibraryModule)
  },
  {
    path: 'account',
    loadChildren: () => import('@modules/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'playlists/:id',
    loadChildren: () => import('@modules/playlists/playlists.module').then(m => m.PlaylistsModule)
  },
  {
    path: 'home',
    redirectTo: '/tracks'
  },
  {
    path:'**',
    component:Page404Component
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
