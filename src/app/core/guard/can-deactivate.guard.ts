import { Injectable } from '@angular/core';
import {  ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable, Observer } from 'rxjs';
import { PromptService } from '../shared/prompt/prompt.service';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;
}

@Injectable({
  providedIn: 'root'
})

export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(private _promptService:PromptService) {}
  canDeactivate(component: CanComponentDeactivate, 
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot) {
      if (component.canDeactivate ) {
        component.canDeactivate()
      }

    return new Observable((observer: Observer<boolean>) => { 
      this._promptService.openDialog({title : 'MACK', content: "You have unsaved data. Are you sure to navigate without saving?" }, (res:any) => {
        if(res == true) { 
          observer.next(res);
          observer.complete();
        }
        else {
          observer.next(false);
          observer.complete();
        }
      });
    })

    }

  confirmNavigation():any {
    this._promptService.openDialog({title : 'MACK', content: "You have unsaved data. Are you sure to navigate without saving?" }, (res:any) => {
      if(res == true) {
        return true;
      }
      return false;
    });
   
  }
  
}
