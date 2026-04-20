import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { LoginRequest } from '../../shared/dto/login-request.dto';
import { LoginResponse } from '../../shared/dto/login-response.dto';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private API = environment.apiUrl

  constructor(private http: HttpClient) {}

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.API}/auth/login`, data)
      .pipe(
        tap(res => {
          const user = res.data;

          localStorage.setItem('token', user.accessToken);
          localStorage.setItem('role', user.role);
          localStorage.setItem('user', JSON.stringify(user));
        })
      );
  }

      getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

}
