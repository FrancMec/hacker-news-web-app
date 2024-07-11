import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Story } from '../models/story';
import { HackerNewsResponse } from '../models/hackerNewsResponse';

@Injectable({
  providedIn: 'root',
})
export class HackerNewsService {
  private apiUrl = 'https://hacker-news-web-api.azurewebsites.net/api/';

  constructor(private http: HttpClient) {}

  getNewestStories(): Observable<HackerNewsResponse> {
    return this.http.get<HackerNewsResponse>(this.apiUrl + 'HackerNews');
  }
}
