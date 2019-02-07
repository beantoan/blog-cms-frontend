import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class AppEventEmitter {
  public onPostDialogClosed = new EventEmitter();
  public onPostDeleted = new EventEmitter();
}
