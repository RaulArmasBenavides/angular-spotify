import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowsePageComponent } from './pages/browse-page/browse-page.component';

const routes: Routes = [
  {
    path: ':kind/:name',
    component: BrowsePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrowseRoutingModule { }
