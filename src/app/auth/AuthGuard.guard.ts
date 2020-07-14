import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

import { AuthService } from './AuthService.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

    constructor(
      private router: Router,
      private auth: AuthService
    ) {}


    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ) {
        if (this.auth.isLoggedIn()) {
          return true
        }
        return this.router.navigate(['/']);
  }
}