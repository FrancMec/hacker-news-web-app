import { TestBed } from '@angular/core/testing';
import { HackerNewsService } from './hacker-news.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HackerNewsResponse } from '../models/hackerNewsResponse';

describe('HackerNewsService', () => {
  let service: HackerNewsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HackerNewsService],
    });
    service = TestBed.inject(HackerNewsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch newest stories', () => {
    const dummyResponse: HackerNewsResponse = {
      statusCode: 200,
      data: [
        { id: 1, title: 'Story 1', url: 'http://story1.com', type: 'story' },
      ],
      errorMessage: undefined,
    };

    service.getNewestStories().subscribe((response) => {
      expect(response.statusCode).toBe(200);
      expect(response.data).toEqual(dummyResponse.data);
      expect(response.errorMessage).toBeUndefined();
    });

    const req = httpMock.expectOne(service['apiUrl'] + 'HackerNews');
    expect(req.request.method).toBe('GET');
    req.flush(dummyResponse);
  });

  it('should handle error response', () => {
    const errorMessage = 'Error loading stories';

    service.getNewestStories().subscribe(
      () => fail('Expected an error, not stories'),
      (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      }
    );

    const req = httpMock.expectOne(service['apiUrl'] + 'HackerNews');
    expect(req.request.method).toBe('GET');

    req.flush(errorMessage, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  });
});
