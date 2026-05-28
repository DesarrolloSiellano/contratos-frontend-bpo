  import { HttpClient, HttpHeaders } from '@angular/common/http';
  import { Observable } from 'rxjs';
  import { enviroment } from '../../../enviroment/enviroment';

export abstract class BaseService<TModel, TResponse> {


  constructor(
    protected http: HttpClient,
    protected baseUrl: string  // URL base para las peticiones
  ) {
 
  }

  getHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token') || '';
    return token 
      ? new HttpHeaders().set('Authorization', `Bearer ${token}`)
      : new HttpHeaders();
  }

  findAll(): Observable<TResponse> {
    return this.http.get<TResponse>(`${enviroment.url}${this.baseUrl}`);
  }

  findByDocument(document: string): Observable<TResponse> {
    return this.http.get<TResponse>(`${enviroment.url}}/${this.baseUrl}/${document}`, { headers: this.getHeaders() });
  }

  findById(id: string): Observable<TResponse> {
    return this.http.get<TResponse>(`${enviroment.url}/${this.baseUrl}/${id}` , { headers: this.getHeaders() });
  }

  findByPage(
    from?: number,
    limit?: number,
    global?: any,
    filters?: string
  ): Observable<TResponse> {
    return this.http.get<TResponse>(`${enviroment.url}/${this.baseUrl}/findByPage?from=${from}&limit=${limit}&global=${global}&filters=${filters}`, { headers: this.getHeaders() });
  }

  findByDate(dateIni?: string, dateEnd?: string): Observable<TResponse> {
    return this.http.get<TResponse>(`${enviroment.url}/${this.baseUrl}/findByDate/?dateIni=${dateIni}&dateEnd=${dateEnd}`, { headers: this.getHeaders() });
  }

  create(item: TModel): Observable<TResponse> {
    return this.http.post<TResponse>(`${enviroment.url}/${this.baseUrl}`, item, { headers: this.getHeaders() });
  }

  update(id: string, item: TModel): Observable<TResponse> {
    return this.http.put<TResponse>(`${enviroment.url}/${this.baseUrl}/${id}`, item, { headers: this.getHeaders() });
  }

  delete(id: string): Observable<TResponse> {
    return this.http.delete<TResponse>(`${enviroment.url}/${this.baseUrl}/${id}`, { headers: this.getHeaders() });
  }
}
