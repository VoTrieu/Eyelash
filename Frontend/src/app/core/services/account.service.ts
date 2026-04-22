import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LoginCreds } from '../../types/user';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  login(creds: LoginCreds){
    return this.http.post(this.baseUrl + 'account/login', creds);
  }
}
