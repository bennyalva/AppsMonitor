import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Application, Client, Pagination } from '../model/rest.model';

export class Response {
  message: string;
  data: any;
}

@Injectable({
  providedIn: 'root'
})

export class ConsumeService {
  private baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) { }

  getApplications(pagination?: Pagination): Observable<Response> {

    if (pagination) {
      const params = new HttpParams()
        .set('page', pagination.page.toString())
        .set('items', pagination.items.toString());
      return this._http.get<Response>(`${this.baseUrl}/points`, { params: params });
    }

    return this._http.get<Response>(`${this.baseUrl}/points`);
  }

  getApplication(id: string): Observable<Response> {
    const params = new HttpParams()
      .set('id', id);
    return this._http.get<Response>(`${this.baseUrl}/points`, { params: params });
  }

  saveApplication(application: Application): Observable<Response> {
    if (application._id) {
      const id = application._id.$oid;
      delete application._id;
      return this._http.put<Response>(`${this.baseUrl}/points/${id}`, application);
    } else {
      return this._http.post<Response>(`${this.baseUrl}/points`, application);
    }
  }

  deleteApplication(id: string): Observable<Response> {
    return this._http.delete<Response>(`${this.baseUrl}/points/${id}`);
  }

  getLatestEvents(application: string, type: string): Observable<Response> {
    const params = new HttpParams()
      .set('application', application)
      .set('type', type)
      .set('sort', 'datetime')
      .set('sortDir', 'desc')
      .set('limit', '30');
    return this._http.get<Response>(`${this.baseUrl}/events`, { params: params });
  }

  getCatalogs(): Observable<Response> {
    return this._http.get<Response>(`${this.baseUrl}/catalogs`);
  }

  getClients(pagination?: Pagination): Observable<Response> {

    if (pagination) {
      const params = new HttpParams()
        .set('page', pagination.page.toString())
        .set('items', pagination.items.toString());
      return this._http.get<Response>(`${this.baseUrl}/clients`, { params: params });
    }

    return this._http.get<Response>(`${this.baseUrl}/clients`);
  }

  getClientsRaw(): Observable<Response> {
    return this._http.get<Response>(`${this.baseUrl}/clients/raw`);
  }

  getClient(id: string): Observable<Response> {
    const params = new HttpParams()
      .set('id', id);
    return this._http.get<Response>(`${this.baseUrl}/clients`, { params: params });
  }

  saveClient(client: Client): Observable<Response> {
    if (client._id) {
      const id = client._id.$oid;
      delete client._id;
      return this._http.put<Response>(`${this.baseUrl}/clients/${id}`, client);
    } else {
      return this._http.post<Response>(`${this.baseUrl}/clients`, client);
    }
  }

  deleteClient(id: string): Observable<Response> {
    return this._http.delete<Response>(`${this.baseUrl}/clients/${id}`);
  }
}
