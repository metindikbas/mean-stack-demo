import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Post } from '../post.model';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading: boolean = false;
  isAuthenticated: boolean = false;
  totalPosts = 10;
  postsPerPage = 3;
  currentPage = 1;
  pageSizeOptions = [1, 3, 5, 10];
  private postsSub: Subscription = new Subscription();
  private authStatusSub: Subscription = new Subscription();

  constructor(
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.isAuthenticated = this.authService.isUserAuthenticated();
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postService
      .getPostUpdateListener()
      .subscribe((postData: { posts: Post[]; totalPosts: number }) => {
        this.isLoading = false;
        this.posts = postData.posts;
        this.totalPosts = postData.totalPosts;
      });
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.isAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(postId: string): void {
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onPageChanged(event: PageEvent): void {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.postsPerPage = event.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }
}
