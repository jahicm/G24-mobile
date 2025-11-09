// auth/token.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = sessionStorage.getItem('token');
  const lang = sessionStorage.getItem('lang') || 'en';
  
  // Skip attaching token for login endpoint
  if (token && !req.url.endsWith('/login')) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Accept-Language': lang
      }
    });
  } else {
    // If no token, still send language header (optional)
    req = req.clone({
      setHeaders: { 'Accept-Language': lang }
    });
  }

  return next(req);
};
