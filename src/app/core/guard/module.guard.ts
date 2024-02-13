import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { StorageService } from '../services/storage/storage.service';
import { AppService } from 'src/app/modules/dashboard/services/app.service';

@Injectable({
  providedIn: 'root',
})
export class ModuleGuard implements CanActivate {
  constructor(private _storage: StorageService, private router: Router, private appServices: AppService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const accessToken = this._storage.getAccessToken();
    const refreshToken = this._storage.getRefereshToken();

    if (accessToken && refreshToken) {
      return true;
    } else {
      this.appServices.destroyPage();
      return false;
    }
  }
}
