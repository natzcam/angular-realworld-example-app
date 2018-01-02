import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';

import { ApiService } from './api.service';

@Injectable()
export class TagsService {
  constructor(
    private apiService: ApiService
  ) { }

  getAll(): Observable<[string]> {
    const params = new URLSearchParams();
    params.set('sql', 'select name from tags');
    params.set('type', 'list');
    return this.apiService.get('', params)
      .map(data => data.payload);
  }

}
