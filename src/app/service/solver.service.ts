import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Coordonnees } from './coordonnees';

@Injectable({
  providedIn: 'root'
})
export class SolverService {

  private resolution$ = new Subject<boolean>();

  private _grille: number[][] = [];
  private mapPossibilites: Map<string, number[]> = new Map();
  private readonly range1_9: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  get resolution(): Observable<boolean> {
    return this.resolution$.asObservable();
  }

  get grille(): number[][] {
    return this._grille.map(ligne => ligne.slice());
  }

  private estResolu(): boolean {
    return !this._grille.some(r => r.some(c => c === 0));
  }

  resoudreSudoku(grille: number[][]): void {
    this._grille = grille.map(ligne => ligne.slice());
    this.initialiserPossibilitesCellules();
    if (!this.estResolu()) {
      this.resolution$.next(this.resoudreGrille());
    } else {
      this.resolution$.next(true);
    }
  }

  private initialiserPossibilitesCellules(): void {
    this.mapPossibilites = new Map();
    this._grille.forEach((ligne, i) => {
      ligne.forEach((cell, j) => {
        this.mapPossibilites.set(i + '' + j, +cell === 0 ? this.range1_9 : [+cell]);
      });
    });
    this.deduireCellulesTriviales();
  }

  /**
   * Fixer les valeurs dans les cellules dont on peut déduire avec certitude la valeur.
   */
  private deduireCellulesTriviales(): void {
    let amelioration = true;
    while (amelioration) {
      amelioration = false;
      this._grille.forEach((ligne, i) => {
        ligne.forEach((cell, j) => {
          if (+cell === 0) {
            this.actualiserValeursPossiblesCellule(i, j);
            if (this._grille[i][j] !== 0) {
              amelioration = true;
            }
          }
        });
      });
    }
  }

  private actualiserValeursPossiblesCellule(i: number, j: number): void {
    const possiblesCell: number[] = this.recupererPossiblesCell(i, j);
    const valeursLigne: number[] = this.recupererValeursLigne(i);
    const valeursColonne: number[] = this.recupererValeursColonne(j);
    const valeursCarre: number[] = this.recupererValeursCarre({ i, j });

    const updatePossiblesCell = possiblesCell
      .filter(p => !valeursLigne.includes(p))
      .filter(p => !valeursColonne.includes(p))
      .filter(p => !valeursCarre.includes(p));

    this.mapPossibilites.set(i + '' + j, updatePossiblesCell);

    if (updatePossiblesCell.length === 1) {
      this._grille[i][j] = updatePossiblesCell[0];
    }
  }

  private recupererValeursCarre(cell: Coordonnees): number[] {
    const ligne: number = cell.i - cell.i % 3;
    const colonne: number = cell.j - cell.j % 3;
    let resultat: number[] = [];

    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        if (this._grille[ligne + x][colonne + y] !== 0) {
          resultat.push(this._grille[ligne + x][colonne + y]);
        }
      }
    }
    return resultat;
  }

  private recupererValeursColonne(j: number): number[] {
    let resultat: number[] = [];
    this._grille.forEach(ligne => {
      if (ligne[j] !== 0)
        resultat.push(ligne[j]);
    });
    return resultat;
  }

  private recupererValeursLigne(i: number): number[] {
    return this._grille[i].filter(v => v !== 0);
  }

  private resoudreGrille(): boolean {
    const cellNonFixee = this.trouverCellNonFixee();
    if (!cellNonFixee) {
      return true;
    }

    const possibles = this.recupererPossiblesCell(cellNonFixee.i, cellNonFixee.j);
    for (let val of possibles) {
      if (this.estValeurPossible(val, cellNonFixee)) {
        this._grille[cellNonFixee.i][cellNonFixee.j] = +val;
        if (this.resoudreGrille()) {
          return true;
        }
        this._grille[cellNonFixee.i][cellNonFixee.j] = 0;
      }
    }
    return false;
  }

  private estValeurPossible(val: number, cell: Coordonnees): boolean {
    const valeursLigne: number[] = this.recupererValeursLigne(cell.i);
    const valeursColonne: number[] = this.recupererValeursColonne(cell.j);
    const valeursCarre: number[] = this.recupererValeursCarre(cell);

    return !valeursLigne.concat(valeursColonne).concat(valeursCarre).includes(val);
  }

  private trouverCellNonFixee(): Coordonnees | undefined {
    let resultat;
    this._grille.forEach((ligne, i) => {
      ligne.forEach((cell, j) => {
        if (cell === 0)
          resultat = { i, j };
      });
    });
    return resultat;
  }

  private recupererPossiblesCell(i: number, j: number): number[] {
    const possibles = this.mapPossibilites.get(i + '' + j);
    return possibles ? possibles : [];
  }
}

