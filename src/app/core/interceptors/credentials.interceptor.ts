import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  // clona a requisição original adicionando a permissão para enviar cookies
  const requestComCookies = req.clone({
    withCredentials: true
  });

  return next(requestComCookies);
};