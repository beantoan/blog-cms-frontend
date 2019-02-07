import {Component, Inject, NgModule, OnInit} from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetModule,
  MatBottomSheetRef,
  MatButtonModule,
  MatDividerModule,
  MatSnackBar, MatSnackBarModule
} from '@angular/material';
import {Post} from '../core/models/post.model';
import {CoreModule} from '../core/core.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {PostService} from '../core/services/post.service';
import {Logger} from '../core/services/logger';
import {AppEventEmitter} from '../core/services/app-event-emitter.service';

@Component({
  selector: 'app-delete-post-sheet',
  templateUrl: './delete-post-sheet.component.html',
  styleUrls: ['./delete-post-sheet.component.css']
})
export class DeletePostSheetComponent implements OnInit {

  errorMessage = null;
  isSubmitting = false;

  constructor(
    private snackBar: MatSnackBar,
    private bottomSheetRef: MatBottomSheetRef<DeletePostSheetComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public post: Post,
    private postService: PostService,
    private appEventEmitter: AppEventEmitter
  ) { }

  ngOnInit() {
  }

  closeSheet(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  deletePost() {
    this.errorMessage = null;
    this.isSubmitting = true;

    this.postService.delete(this.post)
      .subscribe(
        data => {
          this.snackBar.open(data.msg, null, {
            duration: 3000
          });
        },
        err => {
          Logger.info(DeletePostSheetComponent.name, 'deletePost', err);

          this.errorMessage = err.msg;

          this.isSubmitting = false;
        },
        () => {
          this.isSubmitting = false;
          this.bottomSheetRef.dismiss();

          this.appEventEmitter.onPostDeleted.emit(true);
        }
      );
  }
}

@NgModule({
  imports: [
    CoreModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    MatDividerModule,
    MatButtonModule,
    FlexLayoutModule
  ],
  exports: [DeletePostSheetComponent],
  declarations: [DeletePostSheetComponent],
  entryComponents: [DeletePostSheetComponent]
})
export class DeletePostSheetModule {
}

