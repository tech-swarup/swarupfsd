import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../interface/post';
import { PostService } from '../post.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.css']
})
export class PostsListComponent implements OnInit {

  posts: Post[] = [];
  private postSub!: Subscription;

  constructor(private postService: PostService) { }

  ngOnInit(): void {
      this.postService.getPosts();
      
      this.postSub = this.postService.getPostUpdatedListener()
        .subscribe((post: Post[])=>{
            this.posts = post;
        });
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }

  ngOnDestroy(): void {
    this.postSub.unsubscribe();
  }
}
