import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ContactInquiry } from '../../types/contact';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  sendInquiry(inquiry: ContactInquiry) {
    return this.http.post<{ message: string }>(this.baseUrl + 'contact', inquiry);
  }
}
