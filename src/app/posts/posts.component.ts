import { PostService } from './../post.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Post } from '../interface/post';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],
})
export class PostsComponent implements OnInit {
  isLoading = false;
  form!: FormGroup;

  imagePreview!: string;
  private posts!: Post;
  private mode = 'create';
  private postId!: string;

  post: Post = { id: '', title: '', content: '', imagePath: '' };
  //post!: Post;

  constructor(private postService: PostService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z]*')],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required] }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId') as string;
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.isLoading = false;
          // console.log(postData);
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath,
          };

          this.imagePreview = this.post.imagePath;

          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = '';
        // this.isLoading = false;
      }
    });
  }

  onImagePicked(event: Event) {
    //  firstly stores the selected file in the file variable
    // Angular is not aware that event object has files so we have to do TypeCasting
    // console.log(event.target as HTMLInputElement);
    const file = (event.target as HTMLInputElement).files![0];

    if (!this.validateFile(file.name)) {
      console.log('Selected file format is not supported');
      return
    }

    // if (
    //   file.type == 'image/jpeg' ||
    //   file.type == 'image/jpg' ||
    //   file.type == 'image/png'
    // ) {
    //   console.log('Correct File');
    //   console.log(file.name);
    // } else {
    //   console.log('incorrect');
    //   console.log(file.name);
    //   return;
    // }

    // This will store the file object into FormControl
    this.form.patchValue({ image: file });

    // This will call the Validator informs Angular whenever the user makes any change
    this.form.get('image')!.updateValueAndValidity();

    // console.log(file);
    // console.log(this.form);

    // Then we will convert image to dataURI by using the FileReader API. Finally, we will set the dataURI to imageURL variable,

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
  }

  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'png' || ext.toLowerCase() == 'jpeg' || ext.toLowerCase() == 'jpg') {
      return true;
    } else {
      alert('Incorrect format');
      return false;
    }
  }

  get f(){
    return this.form.controls;
  }

  onAddPost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      // this.postService.addPost(form.value.title, form.value.content);
      this.postService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postService.updatedPost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }
}
