import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBarConfig } from '@angular/material/snack-bar';
import { colorCodes } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private snackBar: MatSnackBar) { }

  public message!: string;
  public actionLabel: string | undefined;
  public autoHide: number = 3500;
  public setAutoHide: boolean = false;
  public horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  public verticalPosition: MatSnackBarVerticalPosition = 'top';
  className: string = '';

  loadSnackBar(message:string, colorCodeValue: colorCodes, actionLabel?:string) {
    this.message = message;
    this.actionLabel = actionLabel;
    this.getColorCodes(colorCodeValue);
    this.openSnackBar();
  }

  getColorCodes(colorCodeValue: colorCodes) {
    switch (colorCodeValue) {
      case colorCodes.SUCCESS:
        this.className = "bg-success"
        break;
      case colorCodes.WARNING:
        this.className = "bg-warning"
        break;
      case colorCodes.ERROR:
        this.className = "bg-danger"
        break;
      case colorCodes.INFO:
        this.className = "bg-info"
        break;
      default:
        this.className = ""
        break;
    }
  }
  openSnackBar() {
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPosition;
    config.horizontalPosition = this.horizontalPosition;
    config.panelClass = this.className ? [this.className,'text-white'] : undefined;
    // config.duration = this.className == "bg-success" ? this.autoHide : 0;
    config.duration = this.autoHide;

    this.snackBar.open(
      this.message,
      this.actionLabel ? this.actionLabel : 'close',
      config);
  }
}
