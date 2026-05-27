import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { Environment } from '../../environment/environment';  
import { ProcessAuthData } from './service/process-auth-data';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private processAuthData: ProcessAuthData,) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Revisar si en la URL actual hay access_token como query param
    const accessTokenFromUrl = route.queryParamMap.get('access_token');

    if (accessTokenFromUrl) {
      this.processAuthData.proccesAuthData(accessTokenFromUrl);
      const baseUrl = state.url.split('?')[0];
      this.router.navigateByUrl(baseUrl);
      return true;
    }

    const token = localStorage.getItem('access_token');

    if (!token) {
      this.redirectToLogin(Environment.redirectUri + state.url);
      return false;
    }

    if (!this.isTokenValid(token)) {
      this.redirectToLogin(Environment.redirectUri + state.url);
      return false;
    }

    return true;
  }

  private redirectToLogin(redirectUrl: string) {
    setTimeout(() => {
      const loginUrl = `${Environment.authUrl}?redirect_uri=${encodeURIComponent(
        redirectUrl
      )}`;
      window.location.href = loginUrl;
    }, 500);
  }

  private isTokenValid(token: string): boolean {
    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp && decoded.exp > now;
    } catch {
      return false;
    }
  }
}
