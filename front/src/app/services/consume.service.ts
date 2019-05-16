import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Pagination, Application } from '../model/rest.model';

@Injectable({
  providedIn: 'root'
})

export class ConsumeService {
  private baseUrl = environment.baseUrl;

  constructor(private _http: HttpClient) { }

  getApplications(pagination?: Pagination): Observable<any> {

    if (pagination) {
      const params = new HttpParams()
        .set('page', pagination.page.toString())
        .set('items', pagination.items.toString());
      return this._http.get(`${this.baseUrl}/points`, { params: params });
    }

    return this._http.get(`${this.baseUrl}/points`);
  }

  getApplication(id: string): Observable<any> {
    const params = new HttpParams()
      .set('id', id);
    return this._http.get(`${this.baseUrl}/points`, { params: params });
  }

  saveApplication(application: Application): Observable<any> {
    if (application._id) {
      const id = application._id.$oid;
      delete application._id;
      return this._http.put(`${this.baseUrl}/points/${id}`, application);
    } else {
      return this._http.post(`${this.baseUrl}/points`, application);
    }
  }

  deleteApplication(id: string): Observable<any> {
    return this._http.delete(`${this.baseUrl}/points/${id}`);
  }

  getLatestEvents(application: string): Observable<any> {
    const startDate = moment().add(-1, 'days').toDate().toISOString();
    const endDate = moment().toDate().toISOString();
    const params = new HttpParams()
      .set('application', application)
      .set('startDate', startDate)
      .set('endDate', endDate);
    return this._http.get(`${this.baseUrl}/events`, { params: params });
  }
}
