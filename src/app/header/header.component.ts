import {Component, Input, NgModule, OnInit} from '@angular/core';
import {User} from '../core/models/user.model';
import {UserService} from '../core/services/user.service';
import {
  MatButtonModule,
  MatCardModule,
  MatDialog,
  MatDividerModule,
  MatIconModule,
  MatListModule,
  MatProgressBarModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';

import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {ShowAuthedDirective} from '../core/services/show-authed.directive';
import {FlexLayoutModule} from '@angular/flex-layout';
import {Logger} from '../core/services/logger';
import {AppEventEmitter} from '../core/services/app-event-emitter.service';
import {environment} from '../../environments/environment';
import {PostDialogComponent} from '../post-dialog/post-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['header.component.scss'],
  providers: [],
})
export class HeaderComponent implements OnInit {
  currentUser: User;
  footerTitle = environment.appName;

  @Input() title: string;

  constructor(
    public createTransactionDialog: MatDialog,
    private userService: UserService,
    private appEventEmitter: AppEventEmitter
  ) {
  }

  ngOnInit() {
    this.subscribeEvents();
  }

  private subscribeEvents() {
    this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData;
      }
    );
  }

  private showTransactionDialog() {
    const dialogRef = this.createTransactionDialog.open(PostDialogComponent, {
      width: '800px',
      autoFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      Logger.info(HeaderComponent.name, 'showTransactionDialog', 'dialog is closed', result);

      this.appEventEmitter.onPostDialogClosed.emit(result);
    });
  }

  onCreatePostClicked() {
    this.showTransactionDialog();
  }

  onLogoutClicked() {
    this.userService.logout();
  }

}

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatProgressBarModule,
    FlexLayoutModule
  ],
  exports: [
    ShowAuthedDirective,
    HeaderComponent
  ],
  declarations: [
    ShowAuthedDirective,
    HeaderComponent
  ],
})
export class HeaderModule {}