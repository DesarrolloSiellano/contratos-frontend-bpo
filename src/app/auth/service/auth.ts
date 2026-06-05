import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../../shared/interface/response.interface';
import { environment } from '../../../environment/environment'; 
 
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

  constructor(private http: HttpClient) {}

  changePassword(changePassword: ChangePassword): Observable<Response<any>> {
    return this.http.post<Response<any>>(
      `${environment.url}/auth/change-password`,
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
      `${environment.url}/auth/recovery-password`,
      { email }
    );
  }

  refreshToken(refreshToken: string): Observable<Response<any>> {
    return this.http.post<Response<any>>(
      `${environment.url}/auth/refresh`,
      { refreshToken }
    );
  }

}
