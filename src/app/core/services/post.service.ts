import {Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';

import {ApiService} from './api.service';
import {ApiEndpoints} from './api-endpoints';
import {Logger} from './logger';
import {Observable} from 'rxjs';
import {PageResponse} from '../models/page-response.model';
import {Post} from '../models/post.model';
import {ApiResponse} from '../models/api.response.model';


@Injectable()
export class PostService {
  constructor(
    private apiService: ApiService
  ) {
  }

  index(page: number, size: number): Observable<PageResponse<Post>> {
    Logger.info(PostService.name, 'index',
      `page=${page}, size=${size}`);

    const httpParams = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.apiService.get<PageResponse<Post>>(ApiEndpoints.POSTS, httpParams);
  }

  get(post): Observable<Post> {
    Logger.info(PostService.name, 'get', post);

    return this.apiService.get<Post>(ApiEndpoints.POSTS + '/' + post.id);
  }

  create(post: {}): Observable<ApiResponse> {
    Logger.info(PostService.name, 'create', post);

    return this.apiService.post<ApiResponse>(ApiEndpoints.POSTS, post);
  }

  update(post): Observable<ApiResponse> {
    Logger.info(PostService.name, 'update', post);

    return this.apiService.put<ApiResponse>(ApiEndpoints.POSTS + '/' + post.id, post);
  }

  delete(post): Observable<ApiResponse> {
    Logger.info(PostService.name, 'delete', post);

    return this.apiService.delete<ApiResponse>(ApiEndpoints.POSTS + '/' + post.id);
  }
}
