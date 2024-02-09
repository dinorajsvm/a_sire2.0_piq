import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { StorageService } from '../services/storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class ModuleGuard implements CanActivate {
  constructor(private _storage: StorageService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const accessToken = this._storage.getAccessToken();
    const refreshToken = this._storage.getRefereshToken();

    if (accessToken && refreshToken) {
      return true;
    } else {
      localStorage.clear();
      this.router.navigate(['auth']);
      return false;
    }
  }
}
