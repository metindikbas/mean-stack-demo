import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[]; totalPosts: number }>();
  private baseUrl: string = 'http://localhost:3000/api/';

  constructor(private http: HttpClient, private router: Router) {}

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; totalPosts: number }>(
        this.baseUrl + 'posts' + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post: any) => {
              return {
                id: post._id,
                title: post.title,
                content: post.content,
                imagePath: post.imagePath,
              };
            }),
            totalPosts: postData.totalPosts,
          };
        })
      )
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          totalPosts: transformedPosts.totalPosts,
        });
      });
  }

  getPost(id: string | null) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
    }>(this.baseUrl + 'posts/' + id);
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(this.baseUrl + 'posts', postData)
      .subscribe((res) => {
        this.router.navigate(['/']);
      });
  }

  updatePost(
    id: string | null,
    title: string,
    content: string,
    image: File | string
  ) {
    if (id === null) throw 'id can not be null!';
    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = { id, title, content, imagePath: image };
    }

    this.http
      .put<{ message: string; imagePath: string }>(
        this.baseUrl + 'posts/' + id,
        postData
      )
      .subscribe((res) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string) {
    return this.http.delete<{ message: string }>(
      this.baseUrl + 'posts/' + postId
    );
  }
}
