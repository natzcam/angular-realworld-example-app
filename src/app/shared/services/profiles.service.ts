import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ApiService } from './api.service';
import { Profile } from '../models';
import { UserService } from './user.service';

@Injectable()
export class ProfilesService {
  constructor(
    private apiService: ApiService,
    private userService: UserService
  ) { }

  get(username: string): Observable<Profile> {
    return this.apiService.get('/profiles/' + username)
           .map((data: {profile: Profile}) => data.profile);
  }

  follow(username: string): Observable<Profile> {
    return this.apiService.post(
      `insert into followers (followee, follower)
       values(${username}, {{this.userService.currentUser | async}})`
    );
  }

  unfollow(username: string): Observable<Profile> {
    return this.apiService.post(
      `delete from followers where
       followee = '${username}' and
       follower = '{{this.userService.currentUser | async}}')`
    );
  }

}
