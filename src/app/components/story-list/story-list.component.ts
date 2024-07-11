import { Component, OnInit, ViewChild } from '@angular/core';
import { HackerNewsService } from '../../services/hacker-news.service';
import { Observable, forkJoin } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { Story } from 'src/app/models/story';
import { MatPaginator } from '@angular/material/paginator';
import { HackerNewsResponse } from 'src/app/models/hackerNewsResponse';

@Component({
  selector: 'app-story-list',
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss'],
})
export class StoryListComponent implements OnInit {
  stories: any[] = [];
  page: number = 1;
  pageSize: number = 20;
  isLoading: boolean = false;
  displayedColumns: string[] = ['title', 'url'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<Story>();

  constructor(private hackerNewsService: HackerNewsService) {}

  ngOnInit(): void {
    this.getNewStories();
  }

  getNewStories(): void {
    this.isLoading = true;
    this.hackerNewsService.getNewestStories().subscribe(
      (result: HackerNewsResponse) => {
        this.dataSource = new MatTableDataSource(result.data as Story[]);
        this.dataSource.paginator = this.paginator;
        this.isLoading = false;
      },
      (err) => {
        alert(err);
        this.isLoading = false;
      }
    );
  }

  public search(value: string): void {
    value = value.trim();
    value = value.toLowerCase();

    if (value) {
      this.isLoading = true;
      this.dataSource.filter = value;
      this.isLoading = false;
    } else {
      if (this.dataSource) {
        this.dataSource = new MatTableDataSource(this.dataSource.data);
        this.dataSource.paginator = this.paginator;
      } else this.getNewStories();
    }
  }
}
