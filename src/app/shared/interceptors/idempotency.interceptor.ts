import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';  

// Mapa para almacenar las llaves de idempotencia activas indexadas por Hash
const activeKeys = new Map<string, string>();

/**
 * Interceptor para gestionar la idempotencia en peticiones POST y PATCH.
 * Envía un header 'x-idempotency-key' único. Si se detectan llamadas idénticas
 * consecutivas en menos de 2 segundos (ej: doble clic), reutiliza la misma llave.
 */
export const idempotencyInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  // Solo aplicamos a métodos que crean o mutan datos
  if (req.method === 'POST' || req.method === 'PATCH') {
    // Crear una huella (hash) única basada en el método, URL y cuerpo de la petición
    const requestHash = `${req.method}:${req.url}:${JSON.stringify(req.body)}`;

    let idempotencyKey: string;

    if (activeKeys.has(requestHash)) {
      // 🔄 Doble clic o petición repetida en vuelo detectada. Reutilizamos la llave
      idempotencyKey = activeKeys.get(requestHash)!;
      console.warn(
        `[Idempotency] Petición duplicada en curso. Reutilizando llave: ${idempotencyKey}`,
      );
    } else {
      // 🆕 Petición nueva. Generamos un UUID único
      idempotencyKey = uuidv4();
      activeKeys.set(requestHash, idempotencyKey);
    }

    const clonedRequest = req.clone({
      setHeaders: {
        'x-idempotency-key': idempotencyKey,
      },
    });

    return next(clonedRequest).pipe(
      finalize(() => {
        // Mantenemos la llave retenida durante 2 segundos para amortiguar "dobles clics" veloces.
        // Luego la eliminamos para permitir nuevas peticiones válidas en el futuro.
        setTimeout(() => {
          activeKeys.delete(requestHash);
        }, 2000);
      }),
    );
  }

  return next(req);
};
