import { Post } from './interface/post';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class PostService {

  private post: Post[] = [];
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) { }

  // Display all posts
  getPosts() {
    // this.http.get<{ message: string, posts: any }>('http://localhost:3000/api/posts')
    this.http.get<{ message: string, posts: any }>('https://swarupnode.up.railway.app/api/posts')
    // this.http.get<{ message: string, posts: any }>('https://proswarup.herokuapp.com/api/posts')
      .pipe(map((postData) => {
        return postData.posts.map((post: any) => {
          return {
            id: post._id,
            title: post.title,
            content: post.content,
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe((transformedPost) => {
        this.posts = transformedPost;
        this.postsUpdated.next([...this.posts]);
      });
  
    }

  // Update Subject
  getPostUpdatedListener() {
    return this.postsUpdated.asObservable();
  }

  // Add a new post
  addPost(title: string, content: string, image: File) {
    const postData = new FormData();

    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    // this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
    this.http.post<{ message: string, post: Post }>('https://swarupnode.up.railway.app/api/posts', postData)
    // this.http.post<{ message: string, post: Post }>('https://proswarup.herokuapp.com/api/posts', postData)
      .subscribe((responseData) => {
        const post: Post = {
          id: responseData.post.id,
          title: responseData.post.title,
          content: responseData.post.content,
          imagePath: responseData.post.imagePath
        }
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/load"]);
      });
  }

  // Delete a post from Server
  deletePost(postId: string) {
    this.http.delete('https://swarupnode.up.railway.app/api/posts/' + postId)
    // this.http.delete('https://proswarup.herokuapp.com/api/posts/' + postId)
      .subscribe(() => {
        const updatedPost = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPost;
        this.postsUpdated.next([...this.posts]);
      });
  }

  // Search for a specific post
  getPost(id: string) {
    // return this.http.get<{ _id: string, title: string, content: string }>("http://localhost:3000/api/post/" + id)
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>("https://swarupnode.up.railway.app/api/post/" + id)
    // return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>("https://proswarup.herokuapp.com/api/post/" + id)
  }

  // Update a specific post
  updatedPost(id: string, title: string, content: string, image: File | string) {

    let postData: Post | FormData;

    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
      console.log("New File");
    } else {
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
      console.log("Old File");
    }

    // this.http.put('http://localhost:3000/api/post/' + id, postData)
    // this.http.put('https://studnodefile.herokuapp.com/api/post/' + id, postData)
    this.http.put('https://swarupnode.up.railway.app/api/post/' + id, postData)
      .subscribe((response) => {
        console.log(response);
        this.router.navigate(["/load"]);
      });

  }
}
