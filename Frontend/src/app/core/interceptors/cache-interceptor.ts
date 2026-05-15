import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

interface CacheEntry {
  expiresAt: number;
  response: HttpResponse<unknown>;
}

const cache = new Map<string, CacheEntry>();

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') {
    clearCacheForMutation(req.url);
    return next(req);
  }

  const cacheKey = req.urlWithParams;
  const cached = cache.get(cacheKey);

  if (cached && cached.expiresAt > Date.now()) {
    return of(cached.response.clone()) as Observable<HttpEvent<unknown>>;
  }

  if (cached) {
    cache.delete(cacheKey);
  }

  return next(req).pipe(
    tap((event) => {
      if (event instanceof HttpResponse) {
        cache.set(cacheKey, {
          response: event.clone(),
          expiresAt: Date.now() + 15 * 60 * 1000, // Cache for 15 minutes
        });
      }
    })
  );
};

function clearCacheForMutation(url: string) {
  const normalizedUrl = url.toLowerCase();

  if (
    normalizedUrl.includes('/homepagesettings') ||
    normalizedUrl.includes('/services') ||
    normalizedUrl.includes('/reviews')
  ) {
    cache.clear();
  }
}
