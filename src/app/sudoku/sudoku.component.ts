import { Component, OnInit } from '@angular/core';
import { SolverService } from '../service/solver.service';

@Component({
  selector: 'sudoku',
  templateUrl: './sudoku.component.html',
  styleUrls: ['./sudoku.component.scss']
})
export class SudokuComponent implements OnInit {

  grille: number[][];
  estImpossible = false;

  constructor(private solver: SolverService) {
    this.grille = [...Array(9)].map(x => Array(9).fill(0));
    //this.grille = [
    //[5,3,0,0,7,0,0,0,0],
    //[6,0,0,1,9,5,0,0,0],
    //[0,9,8,0,0,0,0,6,0],
    //[8,0,0,0,6,0,0,0,3],
    //[4,0,0,8,0,3,0,0,1],
    //[7,0,0,0,2,0,0,0,6],
    //[0,6,0,0,0,0,2,8,0],
    //[0,0,0,4,1,9,0,0,5],
    //[0,0,0,0,8,0,0,7,9]];
    /* this.grille = [
      [0,0,2,0,0,0,0,3,1],
      [3,8,0,0,5,2,0,0,0],
      [0,0,0,0,0,0,0,2,0],
      [0,1,0,0,0,0,4,0,6],
      [0,0,6,5,0,0,0,0,8],
      [0,0,0,0,9,0,0,0,0],
      [0,7,0,9,0,0,0,0,5],
      [0,4,0,0,0,0,0,0,0],
      [0,9,0,1,6,0,0,7,0]]; */
  }

  ngOnInit(): void {
    this.solver.resolution.subscribe(reussite => {
      this.estImpossible = !reussite;
      if (reussite) {
        this.grille = this.solver.grille;
      }
    });
  }

  trackByFn(index: any) {
    return index;
  }

  reinitialiserGrille(): void {
    this.grille.map(a => a.fill(0));
    this.estImpossible = false;
  }

  resoudreSudoku(): void {
    //console.time('sudoku');
    this.solver.resoudreSudoku(this.grille);
    //console.timeEnd('sudoku');
  }
}
