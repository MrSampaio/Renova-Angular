import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const requestComCookies = req.clone({ withCredentials: true });
  return next(requestComCookies);
};