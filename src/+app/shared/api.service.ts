import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiService {
  constructor(public _http: Http) {

  }

 /**
  * whatever domain/feature method name
  */
  get(url: string, options?: any) {
    return this._http.get(url, options)
      .map(res => res.json())
      .catch(err => {
        console.log('Error: ', err);
        return Observable.throw(err);
      });
  }

  getTorrentsList(torrentId: string) {
    return this._http.get(`/list?torrentId=${window.btoa(torrentId)}&timestamp=${new Date().getTime()}`)
      .map(res => res.json());
  }

}
