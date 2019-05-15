import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Pagination } from '../model/rest.model';

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
