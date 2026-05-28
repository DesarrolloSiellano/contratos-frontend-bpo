import { Injectable, inject } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { enviroment } from '../../enviroment/enviroment';
import { ProcessAuthData } from './service/process-auth-data';
import { LoadingService } from '../shared/services/loading.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private router = inject(Router);
  private processAuthData = inject(ProcessAuthData);
  private loadingService = inject(LoadingService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    // Revisar si en la URL actual hay access_token y refresh_token como query params
    const accessTokenFromUrl = route.queryParamMap.get('access_token');
    const refreshTokenFromUrl = route.queryParamMap.get('refresh_token');

    if (accessTokenFromUrl) {
      this.loadingService.show();
      this.processAuthData.proccesAuthData(accessTokenFromUrl, refreshTokenFromUrl ?? undefined);
      
      const baseUrl = state.url.split('?')[0];
      
      // Delay de 800ms para una transición visual suave
      setTimeout(() => {
        this.router.navigateByUrl(baseUrl).then(() => {
          this.loadingService.hide();
        }).catch(() => {
          this.loadingService.hide();
        });
      }, 800);

      return true;
    }

    const token = localStorage.getItem('access_token');

    if (!token) {
      this.redirectToLogin(enviroment.redirectUri + state.url);
      return false;
    }

    if (!this.isTokenValid(token)) {
      this.redirectToLogin(enviroment.redirectUri + state.url);
      return false;
    }

    return true;
  }

  private redirectToLogin(redirectUrl: string) {
    setTimeout(() => {
      const loginUrl = `${enviroment.authUrl}?redirect_uri=${encodeURIComponent(
        redirectUrl,
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
