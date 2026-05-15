import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BusyService {
  private activeRequests = signal(0);

  busy = computed(() => this.activeRequests() > 0);

  show() {
    this.activeRequests.update((count) => count + 1);
  }

  hide() {
    this.activeRequests.update((count) => Math.max(0, count - 1));
  }
}
