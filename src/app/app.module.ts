import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { SudokuComponent } from './sudoku/sudoku.component';
import { SelectOnFocusDirective } from './directive/select-on-focus.directive';

@NgModule({
  declarations: [
    AppComponent,
    SudokuComponent,
    SelectOnFocusDirective
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
