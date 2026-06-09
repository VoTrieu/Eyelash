import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs/internal/operators/tap';
import { resolveMediaUrl } from '../helpers/media-url-helper';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private mediaUrl = environment.apiUrl.replace(/api\/?$/, '');
  currentUser = signal<User | null>(this.getUserFromStorage());

  login(creds: LoginCreds){
    return this.http.post<User>(this.baseUrl + 'account/login', creds, { withCredentials: true })
      .pipe(
        tap(user => {
          this.setCurrentUser(user);
        })
      );
  }

  register(creds: RegisterCreds){
    return this.http.post<User>(this.baseUrl + 'account/register', creds, { withCredentials: true })
     .pipe(
        tap(user => {
          this.setCurrentUser(user);
        })
      );
  }

  setCurrentUser(user: User) {
    user.roles = this.getRolesFromToken(user.token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', user.token);
    this.currentUser.set(user);
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.currentUser.set(null);
  }

  updateCurrentUser(value: Partial<Pick<User, 'displayName' | 'email' | 'imageUrl'>>) {
    const user = this.currentUser();
    if (!user) return;

    const updatedUser = { ...user, ...value };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    this.currentUser.set(updatedUser);
  }

  resolveImageUrl(url?: string | null) {
    return resolveMediaUrl(url, this.mediaUrl);
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const payloadObj = JSON.parse(decodedPayload);
      const expiresAt = payloadObj.exp * 1000; // Convert to milliseconds
      return Date.now() < expiresAt;
    } catch {
      return false;
    }
  }

  private getUserFromStorage(): User | null {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  private getRolesFromToken(token: string): string[] {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const payloadObj = JSON.parse(decodedPayload);
    return payloadObj.role || [];
  }
}
