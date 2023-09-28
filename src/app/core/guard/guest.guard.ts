import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanLoad, Route, UrlSegment,UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { StorageService } from '../services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanLoad {
  constructor(private _authService:AuthService, private _storage:StorageService,private dialogRef: MatDialog) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this._authService.isLoggedIn()) {
        const currentUser = this._storage.getUserDetails();
        this._storage.redirectBasedonRoles(currentUser); // needs to be generalized once all the modules integrated
        return false;
      }
      else {
        return true;
      }
  }
}
