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
  MatSnackBar,
  MatSnackBarModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {Logger} from '../core/services/logger';
import {PostService} from '../core/services/post.service';
import {merge} from 'rxjs';
import {CoreModule} from '../core/core.module';
import {AppEventEmitter} from '../core/services/app-event-emitter.service';


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
    @Inject(MAT_DIALOG_DATA) public data = {post: null, onlyView: false},
    private dialogRef: MatDialogRef<PostDialogComponent>,
    private appEventEmitter: AppEventEmitter
  ) { }

  ngOnInit() {
    this.buildPostForm();
    this.subscribeEvents();
  }

  private getPostFormData() {
    const data = this.postForm.value;

    if (this.data.post) {
      data.id = this.data.post.id;
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

      const observable = this.data.post ? this.postService.update(postData) : this.postService.create(postData);

      observable.subscribe(
          data => {

            this.savedPostData = postData;

            this.resetPostForm();

            this.snackBar.open(data.msg, null, {
              duration: 3000
            });

            this.appEventEmitter.onPostDialogClosed.next(true);
          },
          err => {
            Logger.info(PostDialogComponent.name, 'createNewPost', err);

            this.errorMessage = err.msg;

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

    const isDisabled = this.data.onlyView;

    if (this.data.post) {
      titleVal = this.data.post.title;
      contentVal = this.data.post.content;
    }

    this.postForm = new FormGroup({
      title: new FormControl({value: titleVal, disabled: isDisabled}, [Validators.required]),
      content: new FormControl({value: contentVal, disabled: isDisabled}, [Validators.required])
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

  getTitle() {
    if (this.data.onlyView) {
      return 'View post';
    } else {
      return (this.data.post && this.data.post.id) ? 'Edit post' : 'Create new post';
    }
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
