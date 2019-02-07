import {Component, NgModule, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {
  MatBottomSheet,
  MatButtonModule,
  MatCardModule,
  MatDialog,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginator,
  MatPaginatorModule,
  MatProgressBarModule, MatSnackBar, MatSnackBarModule,
  MatTableModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {Logger} from '../core/services/logger';
import {PostDialogComponent} from '../post-dialog/post-dialog.component';
import {PostService} from '../core/services/post.service';
import {PageResponse} from '../core/models/page-response.model';
import {Post} from '../core/models/post.model';
import {CoreModule} from '../core/core.module';
import {DeletePostSheetComponent} from '../delete-post-sheet/delete-post-sheet.component';
import {AppEventEmitter} from '../core/services/app-event-emitter.service';
import {merge} from 'rxjs';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit, OnDestroy {

  postsPageResponse: PageResponse<Post> = new PageResponse<Post>();

  postsPageSize = 15;
  isLoadingPosts = false;

  tableColumns = ['title', 'content', 'createdAt', 'actions'];

  @ViewChild('postsPaginator') postsPaginator: MatPaginator;

  constructor(
    private snackBar: MatSnackBar,
    private createPostDialog: MatDialog,
    private deletePostSheet: MatBottomSheet,
    private postService: PostService,
    private appEventEmitter: AppEventEmitter
  ) { }

  ngOnInit() {
    this.loadPosts(1);

    this.subscribeEvents();
  }

  ngOnDestroy() {
    this.unsubscribeEvents();
  }

  private unsubscribeEvents() {
    this.postsPaginator.page.unsubscribe();
    this.appEventEmitter.onPostDialogClosed.unsubscribe();
    this.appEventEmitter.onPostDeleted.unsubscribe();
  }

  private subscribeEvents() {
    this.postsPaginator.page.subscribe(event => {
      this.loadPosts(this.postsPaginator.pageIndex + 1);
    });

    merge(
      this.appEventEmitter.onPostDialogClosed,
      this.appEventEmitter.onPostDeleted
    ).subscribe(data => {
      if (data) {
        this.loadPosts(1);
      }
    });
  }

  private loadPosts(page: number) {
    this.isLoadingPosts = true;

    this.postService.index(page, this.postsPageSize)
      .subscribe(data => {
        this.postsPageResponse = data;
        this.isLoadingPosts = false;
      }, err => {
        this.isLoadingPosts = false;
      });
  }

  private showPostDialog(post: Post, onlyView: boolean) {
    this.createPostDialog.open(PostDialogComponent, {
      width: '800px',
      autoFocus: true,
      data: {
        post,
        onlyView
      }
    });
  }

  onAddPostClicked() {
    this.showPostDialog(null, false);
  }

  onEditPostClicked(post: Post) {
    this.showPostDialog(post, false);
  }

  onViewPostClicked(post: Post) {
    this.isLoadingPosts = true;

    this.postService.get(post).subscribe(
      data => {
        this.showPostDialog(data, true);
      },
      error => {
        Logger.info(PostDialogComponent.name, 'onViewPostClicked', error);

        this.snackBar.open(error.msg, null, {
          duration: 3000
        });

        this.isLoadingPosts = false;
      },
      () => {
        this.isLoadingPosts = false;
      }
    );
  }

  onDeletePostClicked(post: Post) {
    this.deletePostSheet.open(DeletePostSheetComponent, {
      data: post
    });
  }
}

@NgModule({
  imports: [
    CoreModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatDividerModule,
    FlexLayoutModule
  ],
  exports: [PostComponent],
  declarations: [PostComponent],
})
export class PostModule {
}
