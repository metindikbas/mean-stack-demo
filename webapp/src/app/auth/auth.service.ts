import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl: string = 'http://localhost:3000/api/authorization/';
  private token: string | null = null;
  private authStatusListener: Subject<boolean> = new Subject<boolean>();
  private isAuthenticated: boolean = false;
  private tokenTimer: NodeJS.Timer;

  constructor(private http: HttpClient, private router: Router) {
    this.tokenTimer = setTimeout(() => {}, 1999999999);
  }

  getToken(): string | null {
    return this.token;
  }

  isUserAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ message: string; user: any }>(this.baseUrl + 'signup', authData)
      .subscribe((res) => {
        console.log(res);
      });
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ message: string; token: string; expiresIn: number }>(
        this.baseUrl + 'login',
        authData
      )
      .subscribe((res) => {
        this.token = res.token;
        if (this.token) {
          const expiresInDuration = res.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.authStatusListener.next(this.isAuthenticated);
          const now = new Date();
          const expirationDate = new Date(
            now.getTime() + expiresInDuration * 1000
          );
          this.saveAuthData(res.token, expirationDate);
          this.router.navigate(['/']);
        }
      });
  }

  logout(): void {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(this.isAuthenticated);
    this.router.navigate(['/']);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
  }

  autoAuthUser(): void {
    const authData = this.getAuthData();
    if (authData) {
      const now = new Date();
      const expiresInDuration =
        authData.expirationDate.getTime() - now.getTime();
      if (expiresInDuration > 0) {
        this.token = authData.token;
        this.isAuthenticated = true;
        this.authStatusListener.next(this.isAuthenticated);
        this.setAuthTimer(expiresInDuration);
      }
    }
  }

  private saveAuthData(token: string, expirationDate: Date): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) return;
    return {
      token: token,
      expirationDate: new Date(expirationDate),
    };
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
