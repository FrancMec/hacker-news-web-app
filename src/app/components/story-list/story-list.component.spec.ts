import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StoryListComponent } from './story-list.component';
import { DebugElement } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HackerNewsService } from '../../services/hacker-news.service';
import { Story } from '../../models/story';
import { HackerNewsResponse } from '../../models/hackerNewsResponse';
import { of, throwError } from 'rxjs';

describe('StoryListComponent', () => {
  let component: StoryListComponent;
  let fixture: ComponentFixture<StoryListComponent>;
  let mockHackerNewsService: jasmine.SpyObj<HackerNewsService>;
  let element: DebugElement;

  beforeEach(waitForAsync(() => {
    mockHackerNewsService = jasmine.createSpyObj('HackerNewsService', [
      'getNewestStories',
    ]);

    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: HackerNewsService, useValue: mockHackerNewsService },
      ],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(StoryListComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load stories on initialization', waitForAsync(() => {
    const mockStories: Story[] = [
      { id: 1, title: 'NewsStory1', url: 'http://story1.com', type: 'story' },
      { id: 2, title: 'SportStory1', url: 'http://sport.com', type: 'story' },
    ];

    const result: HackerNewsResponse = {
      data: mockStories,
      statusCode: 200,
      errorMessage: undefined,
    };
    mockHackerNewsService.getNewestStories.and.returnValue(of(result));

    fixture.detectChanges(); // ngOnInit

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.isLoading).toBeFalse();
      expect(component.dataSource.data).toEqual(mockStories);
    });
  }));

  it('should handle error while loading stories', waitForAsync(() => {
    mockHackerNewsService.getNewestStories.and.returnValue(
      throwError(() => 'Service error')
    );

    spyOn(window, 'alert');

    fixture.detectChanges(); // ngOnInit

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.isLoading).toBeFalse();
      expect(window.alert).toHaveBeenCalledWith('Service error');
    });
  }));

  it('should filter stories based on search input and give the result', () => {
    const mockStories: Story[] = [
      { id: 1, title: 'NewsStory1', url: 'http://story1.com', type: 'story' },
      { id: 2, title: 'SportStory1', url: 'http://sport.com', type: 'story' },
    ];

    const result: HackerNewsResponse = {
      data: mockStories,
      statusCode: 200,
      errorMessage: undefined,
    };
    mockHackerNewsService.getNewestStories.and.returnValue(of(result));

    fixture.detectChanges(); // ngOnInit

    component.search('NewsStory1');
    fixture.detectChanges();

    expect(component.dataSource.filteredData.length).toBe(1);
    expect(component.dataSource.filteredData[0].title).toContain('NewsStory1');
  });

  it('should filter stories based on search input when data is not present in the list', () => {
    const mockStories: Story[] = [
      { id: 1, title: 'NewsStory1', url: 'http://story1.com', type: 'story' },
      { id: 2, title: 'SportStory1', url: 'http://sport.com', type: 'story' },
    ];

    const result: HackerNewsResponse = {
      data: mockStories,
      statusCode: 200,
      errorMessage: undefined,
    };
    mockHackerNewsService.getNewestStories.and.returnValue(of(result));

    fixture.detectChanges(); // ngOnInit

    component.search('angular');
    fixture.detectChanges();

    expect(component.dataSource.filteredData.length).toBe(0);
  });

  it('should reset and reload stories when search input is cleared', () => {
    const mockStories: Story[] = [
      { id: 1, title: 'NewsStory1', url: 'http://story1.com', type: 'story' },
      { id: 2, title: 'SportStory1', url: 'http://sport.com', type: 'story' },
    ];

    const result: HackerNewsResponse = {
      data: mockStories,
      statusCode: 200,
      errorMessage: undefined,
    };
    mockHackerNewsService.getNewestStories.and.returnValue(of(result));

    fixture.detectChanges();

    component.search('');
    fixture.detectChanges();

    expect(component.dataSource.data).toEqual(mockStories);
  });
});
