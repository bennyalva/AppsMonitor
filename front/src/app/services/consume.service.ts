import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Pagination, Application } from '../model/rest.model';

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

  getLatestEvents(application: string): Observable<Response> {
    const startDate = moment().add(-1, 'days').toDate().toISOString();
    const endDate = moment().toDate().toISOString();
    const params = new HttpParams()
      .set('application', application)
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this._http.get<Response>(`${this.baseUrl}/events`, { params: params });
  }
}
