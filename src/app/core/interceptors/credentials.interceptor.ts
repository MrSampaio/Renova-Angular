import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const requestWithCookies = req.clone({ withCredentials: true });
  return next(requestWithCookies);
};