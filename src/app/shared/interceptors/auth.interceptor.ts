import { HttpInterceptorFn } from '@angular/common/http';


export const tokenCaptureInterceptor: HttpInterceptorFn = (req, next) => {
  // Crear URL absoluta para analizar query params
  const url = new URL(req.urlWithParams, window.location.origin);

  const token = url.searchParams.get('access_token');

  if (token) {
    // Guardar token en localStorage
    localStorage.setItem('access_token', token);
    

    // Eliminar token de la URL
    url.searchParams.delete('access_token');

    // Clonar request con URL limpia
    const cleanReq = req.clone({ url: url.toString() });
  
    return next(cleanReq);
  }

  return next(req);
};
