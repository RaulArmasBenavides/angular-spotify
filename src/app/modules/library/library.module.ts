import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LibraryRoutingModule } from './library-routing.module';
import { LibraryPageComponent } from './pages/library-page/library-page.component';


@NgModule({
  declarations: [
    LibraryPageComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LibraryRoutingModule
  ]
})
export class LibraryModule { }
