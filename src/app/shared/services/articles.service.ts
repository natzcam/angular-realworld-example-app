import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as squel from 'squel';

import { ApiService } from './api.service';
import { Article, ArticleListConfig } from '../models';

@Injectable()
export class ArticlesService {
  constructor(
    private apiService: ApiService
  ) { }

  query(config: ArticleListConfig): Observable<{ articles: Article[], articlesCount: number }> {
    // Convert any filters over to Angular's URLSearchParams
    squel.select()
    const params: URLSearchParams = new URLSearchParams();
    params.set('sql',
      ` select * from follows
        left join articles on follows.user_id = articles.user_id
        order by created_at
      `
    );

    return this.apiService
      .get('', params).map(data => data);
  }

  get(slug): Observable<Article> {
    return this.apiService.get('/articles/' + slug)
      .map(data => data.article);
  }

  destroy(slug) {
    return this.apiService.delete('/articles/' + slug);
  }

  save(article): Observable<Article> {
    // If we're updating an existing article
    if (article.slug) {
      return this.apiService.put('/articles/' + article.slug, { article: article })
        .map(data => data.article);

      // Otherwise, create a new article
    } else {
      return this.apiService.post('/articles/', { article: article })
        .map(data => data.article);
    }
  }

  favorite(slug): Observable<Article> {
    return this.apiService.post('/articles/' + slug + '/favorite');
  }

  unfavorite(slug): Observable<Article> {
    return this.apiService.delete('/articles/' + slug + '/favorite');
  }


}
