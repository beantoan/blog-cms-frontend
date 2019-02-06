import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {JwtService} from '../services/jwt.service';
import {UserService} from '../services/user.service';
import {ApiEndpoints} from '../services/api-endpoints';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const jwtToken = this.jwtService.getToken();

    const headers = {
      Authorization: jwtToken || ''
    };

    const excludedUrls = [ApiEndpoints.USER_LOGIN, ApiEndpoints.USER_REGISTER];

    if (!jwtToken && excludedUrls.indexOf(req.url) === -1) {
      this.userService.logout();
    }

    const request = req.clone({setHeaders: headers});

    return next.handle(request);
  }
}
