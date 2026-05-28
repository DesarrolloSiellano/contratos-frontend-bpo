import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../shared/interface/response.interface';
import { enviroment } from '../../../enviroment/enviroment'; 
 
export interface LoginRequest {
  email: string;
  password: string;
  redirectUri?: string;
}

export interface ChangePassword {
  id: string;
  currentPassword: string;
  newPassword: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  refreshToken(refreshToken: string) {
    throw new Error('Method not implemented.');
  }
  constructor(private http: HttpClient) {}

  changePassword(changePassword: ChangePassword): Observable<Response<any>> {
    return this.http.post<Response<any>>(
      `${enviroment.url}/auth/change-password`,
      changePassword,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
      }
    );
  }

  recoveryPassword(email: string): Observable<Response<any>> {
    return this.http.post<Response<any>>(
      `${enviroment.url}/auth/recovery-password`,
      { email }
    );
  }
}
