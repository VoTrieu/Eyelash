import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginCreds, User } from '../../types/user';
import { tap } from 'rxjs/internal/operators/tap';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  currentUser = signal<User | null>(null);

  login(creds: LoginCreds){
    return this.http.post<User>(this.baseUrl + 'account/login', creds, { withCredentials: true })
      .pipe(
        tap(user => {
          this.setCurrentUser(user);
        })
      );
  }

  setCurrentUser(user: User) {
    user.roles = this.getRolesFromToken(user.token);
    this.currentUser.set(user);
  } 

  private getRolesFromToken(token: string): string[] {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    const payloadObj = JSON.parse(decodedPayload);
    return payloadObj.role || [];
  }
}
