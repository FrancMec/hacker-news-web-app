import { Component, NO_ERRORS_SCHEMA, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Story } from '../../models/story';
import { HackerNewsService } from '../../services/hacker-news.service';
import { HackerNewsResponse } from '../../models/hackerNewsResponse';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-story-list',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    MatPaginatorModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatProgressSpinnerModule,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  templateUrl: './story-list.component.html',
  styleUrl: './story-list.component.css',
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
