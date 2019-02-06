import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';

import {catchError} from 'rxjs/operators';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient
  ) {
  }

  private formatErrors(error: any) {
    return throwError(error.error);
  }

  private buildUrl(path: string) {
    return `${environment.apiUrl}${path}`;
  }

  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    const url = this.buildUrl(path);

    return this.http.get<T>(url, {params})
      .pipe(catchError(this.formatErrors));
  }

  put<T>(path: string, body: object = {}): Observable<T> {
    const url = this.buildUrl(path);

    return this.http.put<T>(url, body)
      .pipe(catchError(this.formatErrors));
  }

  post<T>(path: string, data: object = {}): Observable<T> {
    const url = this.buildUrl(path);

    return this.http.post<T>(url, data)
      .pipe(catchError(this.formatErrors));
  }

  delete<T>(path): Observable<T> {
    const url = this.buildUrl(path);

    return this.http.delete<T>(url)
      .pipe(catchError(this.formatErrors));
  }
}
