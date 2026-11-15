import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowseRoutingModule } from './browse-routing.module';
import { BrowsePageComponent } from './pages/browse-page/browse-page.component';
import { SharedModule } from '@shared/shared.module';


@NgModule({
  declarations: [
    BrowsePageComponent
  ],
  imports: [
    CommonModule,
    BrowseRoutingModule,
    SharedModule
  ]
})
export class BrowseModule { }
