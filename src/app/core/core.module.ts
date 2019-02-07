import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthenticationInterceptor} from './interceptors/authentication.interceptor';
import {ApiService} from './services/api.service';
import {AuthGuard} from './services/auth-guard.service';
import {JwtService} from './services/jwt.service';
import {NoAuthGuard} from './services/no-auth-guard.service';
import {RouterModule} from '@angular/router';
import {RoutingStateService} from './services/routing-state.service';
import {AppEventEmitter} from './services/app-event-emitter.service';
import {PostService} from './services/post.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {UserService} from './services/user.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TruncatePipe} from './services/truncate.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthenticationInterceptor, multi: true},
    ApiService,
    AuthGuard,
    NoAuthGuard,
    JwtService,
    PostService,
    UserService,
    RoutingStateService,
    AppEventEmitter
  ],
  exports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    TruncatePipe
  ],
  declarations: [
    TruncatePipe
  ]
})
export class CoreModule {
}
