import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class SampleDataService {
  private endpoint: string = 'https://localhost:5001/JsonFile?fileName=';
  private static cache: any = {};

  private httpOptions: any = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    body: null
  };

  constructor(private http: HttpClient) { }

  public get(filename: string): Promise<any[]> {
    if (_.has(SampleDataService.cache, filename)) {
      return new Promise((rs) => {
        rs(SampleDataService.cache[filename]);
      });
    }
    else {
      return this.http.get(this.endpoint + filename, this.httpOptions)
        .toPromise()
        .then((res) => {
          const response: any = res;
          SampleDataService.cache[filename] = response;
          return response;
        })
        .catch(this.errorHandler);
    }
  }

  private errorHandler(err) {
    console.log('Error occurred.', err);
    return Promise.reject(err.message || err);
  }
}
