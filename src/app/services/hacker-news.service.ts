import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HackerNewsResponse } from '../models/hackerNewsResponse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HackerNewsService {
  private apiUrl = 'https://localhost:7083/api/';

  constructor(private http: HttpClient) {}

  getNewestStories(): Observable<HackerNewsResponse> {
    return this.http.get<HackerNewsResponse>(this.apiUrl + 'HackerNews');
  }
}
