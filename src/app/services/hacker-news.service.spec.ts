import { TestBed } from '@angular/core/testing';

import { HackerNewsService } from './hacker-news.service';
import { HttpClientModule } from '@angular/common/http';

describe('HackerNewsService', () => {
  let service: HackerNewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
    });
    service = TestBed.inject(HackerNewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
