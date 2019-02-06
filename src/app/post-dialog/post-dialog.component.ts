import {Component, Inject, NgModule, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatDialogRef,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatProgressBarModule,
  MatSnackBar, MatSnackBarModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {Logger} from '../core/services/logger';
import {Post} from '../core/models/post.model';
import {PostService} from '../core/services/post.service';
import {merge} from 'rxjs';
import {CoreModule} from '../core/core.module';


@Component({
  selector: 'app-post-dialog',
  templateUrl: './post-dialog.component.html',
  styleUrls: ['./post-dialog.component.css'],
  providers: [
  ]
})
export class PostDialogComponent implements OnInit {
  postForm: FormGroup;

  errorMessage = null;
  isSubmitting = false;

  private savedPostData: {} = null;

  constructor(
    private snackBar: MatSnackBar,
    private postService: PostService,
    @Inject(MAT_DIALOG_DATA) public post: Post,
    private dialogRef: MatDialogRef<PostDialogComponent>,
  ) { }

  ngOnInit() {
    this.buildPostForm();
    this.subscribeEvents();
  }

  private getPostFormData() {
    const data = this.postForm.value;

    if (this.post) {
      data.id = this.post.id;
    }

    return data;
  }

  private createNewPost() {
    Logger.info(PostDialogComponent.name, 'createNewPost', this.postForm.value);

    this.errorMessage = null;
    this.isSubmitting = true;

    this.savedPostData = null;

    if (this.postForm.valid) {
      const postData = this.getPostFormData();

      this.postService.create(postData)
        .subscribe(
          data => {

            this.savedPostData = postData;

            this.resetPostForm();

            const message = this.post && this.post.id ? 'Edited post successfully' : 'Created new post successfully';

            this.snackBar.open(message, null, {
              duration: 3000
            });
          },
          err => {
            Logger.info(PostDialogComponent.name, 'createNewPost', err);

            if (this.post && this.post.id) {
              this.errorMessage = 'Error when editing the post';
            } else {
              this.errorMessage = 'Error when creating a post';
            }

            this.isSubmitting = false;
          },
          () => {
            this.isSubmitting = false;
          }
        );
    } else {
      this.setPostFormFieldsAsTouched();

      this.errorMessage = 'Enter the required information';

      this.isSubmitting = false;
    }
  }

  private setPostFormFieldsAsTouched() {
    const titleInputField = this.postForm.get('title');
    const contentInputField = this.postForm.get('content');

    titleInputField.markAsTouched();
    contentInputField.markAsTouched();
  }

  /**
   * Create a post form
   */
  private buildPostForm() {

    let titleVal = '';
    let contentVal = '';

    if (this.post) {
      titleVal = this.post.title;
      contentVal = this.post.content;
    }

    this.postForm = new FormGroup({
      title: new FormControl(titleVal, [Validators.required]),
      content: new FormControl(contentVal, [Validators.required])
    });
  }

  private resetPostForm() {
    const titleInputField = this.postForm.get('title');
    const contentInputField = this.postForm.get('content');

    titleInputField.setValue('');
    titleInputField.markAsUntouched();

    contentInputField.setValue('');
    contentInputField.markAsUntouched();
  }

  private subscribeEvents() {
    merge(
      this.postForm.get('title').valueChanges,
      this.postForm.get('content').valueChanges
    ).subscribe(data => {
      this.errorMessage = null;
    });
  }

  onSavePostClicked() {
    this.createNewPost();
  }

  onCloseDialogClicked() {
    Logger.info(PostDialogComponent.name, 'onCloseDialogClicked', this.savedPostData);

    this.dialogRef.close(this.savedPostData);
  }
}

@NgModule({
  imports: [
    CoreModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatProgressBarModule,
    MatSnackBarModule,
    FlexLayoutModule
  ],
  exports: [PostDialogComponent],
  declarations: [PostDialogComponent],
  entryComponents: [PostDialogComponent]
})
export class PostDialogModule {
}
