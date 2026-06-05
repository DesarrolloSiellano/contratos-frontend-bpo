import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';

export abstract class BaseService<TModel, TResponse> {

  constructor(
    protected http: HttpClient,
    protected baseUrl: string  // Recibe 'contract' desde el hijo
  ) {}

  // Genera las cabeceras buscando el token de forma exhaustiva en el LocalStorage
  getHeaders(): HttpHeaders {
    // 1. Intenta leer directamente la variable access_token
    let token = localStorage.getItem('access_token') || '';

    // 2. Si no existe, intenta extraerlo del objeto contractsModule
    if (!token) {
      const storageModule = localStorage.getItem('contractsModule');
      if (storageModule) {
        try {
          // Si guardaron el objeto de sesión completo como texto JSON, extraemos sus propiedades
          const parsed = JSON.parse(storageModule);
          token = parsed.access_token || parsed.token || parsed.accessToken || storageModule;
        } catch (e) {
          // Si no es un JSON válido, asumimos que el texto plano es el token
          token = storageModule;
        }
      }
    }

    // 3. Si se encuentra un token, inyecta la cabecera Bearer, si no, envía cabeceras vacías
    return token 
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();
  }

  findAll(): Observable<TResponse> {
    return this.http.get<TResponse>(`${environment.url}/${this.baseUrl}`, { headers: this.getHeaders() });
  }

  findByDocument(document: string): Observable<TResponse> {
    return this.http.get<TResponse>(`${environment.url}/${this.baseUrl}/${document}`, { headers: this.getHeaders() });
  }

  findById(id: string): Observable<TResponse> {
    return this.http.get<TResponse>(`${environment.url}/${this.baseUrl}/${id}` , { headers: this.getHeaders() });
  }

  findByPage(
    from?: number,
    limit?: number,
    global?: any,
    filters?: string
  ): Observable<TResponse> {
    return this.http.get<TResponse>(`${environment.url}/${this.baseUrl}/findByPage?from=${from}&limit=${limit}&global=${global}&filters=${filters}`, { headers: this.getHeaders() });
  }

  findByDate(dateIni?: string, dateEnd?: string): Observable<TResponse> {
    return this.http.get<TResponse>(`${environment.url}/${this.baseUrl}/findByDate/?dateIni=${dateIni}&dateEnd=${dateEnd}`, { headers: this.getHeaders() });
  }

  create(item: TModel): Observable<TResponse> {
    return this.http.post<TResponse>(`${environment.url}/${this.baseUrl}`, item, { headers: this.getHeaders() });
  }

  update(id: string, item: TModel): Observable<TResponse> {
    return this.http.put<TResponse>(`${environment.url}/${this.baseUrl}/${id}`, item, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<TResponse> {
    return this.http.delete<TResponse>(`${environment.url}/${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }
}

