import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { JwtPayload } from '../../shared/interface/jwt-payload.interface';
import { enviroment } from '../../../enviroment/enviroment';
import { ConfirmService } from '../../shared/services/confirm-dialog.service';

@Injectable({
  providedIn: 'root',
})
export class ProcessAuthData {
  constructor(private confirmService: ConfirmService) {}


  proccesAuthData(token: string, refreshToken?: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const validatedModuleExists = decoded.modules.some(
        (mod) => mod.name === enviroment.storageKey,
      );

      if (!validatedModuleExists) {
        this.confirmService.showMessage(
          'error',
          `No tienes permisos para acceder a esta módulo`,
          'Contacta al administrador del sistema',
        );
        return;
      }

      localStorage.setItem('access_token', token);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      localStorage.setItem('date_joined', decoded.date_joined);
      localStorage.setItem('exp', String(decoded.exp));
      localStorage.setItem('company', String(decoded.company));
      localStorage.setItem('iat', String(decoded.iat));
      localStorage.setItem('isActive', String(decoded.isActived));
      localStorage.setItem('isAdmin', String(decoded.isAdmin));
      localStorage.setItem('isSuperAdmin', String(decoded.isSuperAdmin));
      localStorage.setItem('isNewUser', String(decoded.isNewUser));
      localStorage.setItem('userName', decoded.name);
      localStorage.setItem('email', decoded.email);
      localStorage.setItem('_id', decoded._id);
      this.saveModulesToLocalStorage(decoded.modules);
    } catch (error) {
      console.error(error);
    }
  }

  saveModulesToLocalStorage(modules: any[]) {
    modules.forEach((mod) => {
      localStorage.setItem(mod.name, JSON.stringify(mod));
    });
  }
}
