import {Component, NgModule, OnInit} from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatDialog,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatTableModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {Logger} from '../core/services/logger';
import {PostDialogComponent} from '../post-dialog/post-dialog.component';
import {PostService} from '../core/services/post.service';
import {PageResponse} from '../core/models/page-response.model';
import {Post} from '../core/models/post.model';
import {CoreModule} from '../core/core.module';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  postsPageResponse: PageResponse<Post> = new PageResponse<Post>();

  postsPageSize = 30;
  isLoadingPosts = false;

  constructor(
    public createPostDialog: MatDialog,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.loadPosts();
  }

  private loadPosts() {
    this.isLoadingPosts = true;

    this.postService.index(0, this.postsPageSize)
      .subscribe(data => {
        this.postsPageResponse = data;
        this.isLoadingPosts = false;
      }, err => {
        this.isLoadingPosts = false;
      });
  }

  private showPostDialog(post: Post) {
    const dialogRef = this.createPostDialog.open(PostDialogComponent, {
      width: '800px',
      autoFocus: true,
      data: post
    });

    dialogRef.afterClosed().subscribe(result => {
      Logger.info(PostComponent.name, 'showPostDialog', 'dialog is closed', result);

      if (result) {
        this.loadPosts();
      }
    });
  }

  onAddPostClicked() {
    this.showPostDialog(null);
  }

  onEditPostClicked(post: Post) {
    this.showPostDialog(post);
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
