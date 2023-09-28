import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PromptComponent } from './prompt.component';

@Injectable({
  providedIn: 'root'
})
export class PromptService {

  constructor(public _dialog: MatDialog) { }

  openDialog(config:any, closeCallback:any) { 
      const dialogRef = this._dialog.open(PromptComponent, {
        width: config.width ? config.width :'350px',
        data: config
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result){
          closeCallback(result);
        }
      });
   }
}
