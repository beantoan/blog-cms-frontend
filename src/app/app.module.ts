import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {CoreModule} from './core/core.module';
import {PostDialogModule} from './post-dialog/post-dialog.component';
import {PostModule} from './post/post.component';
import {FooterModule} from './footer/footer.component';
import {HeaderModule} from './header/header.component';
import {LoginModule} from './login/login.component';
import {DeletePostSheetModule} from './delete-post-sheet/delete-post-sheet.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    CoreModule,
    BrowserModule,
    AppRoutingModule,
    FooterModule,
    HeaderModule,
    PostDialogModule,
    PostModule,
    LoginModule,
    DeletePostSheetModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
