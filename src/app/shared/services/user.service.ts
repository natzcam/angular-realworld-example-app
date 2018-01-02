import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { Errors } from '../models/errors.model';


@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>(new User());
  public currentUser = this.currentUserSubject.asObservable().distinctUntilChanged();

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private http: Http,
    private jwtService: JwtService,
    private afAuth: AngularFireAuth
  ) { }

  populate() {
    this.afAuth.idToken.subscribe(token => {
      console.log('token: ' + token);
      if (token) {
        this.jwtService.saveToken(token);
      } else {
        this.jwtService.destroyToken();
      }
    });

    this.populateUser();
  }

  private populateUser() {
    if (this.jwtService.getToken()) {
      this.apiService.query({
        type: 'single',
        sql: `select * from users`,
      }).subscribe(
        data => this.setAuth(data.payload),
        err => this.purgeAuth()
        );
    } else {
      this.purgeAuth();
    }
  }

  setAuth(user: User) {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  purgeAuth() {
    this.jwtService.destroyToken();
    this.currentUserSubject.next(new User());
    this.isAuthenticatedSubject.next(false);
    this.afAuth.auth.signOut();
  }

  attemptAuth(type, credentials): Observable<any> {
    const route = (type === 'login') ? '/login' : '';
    if (type === 'login') {
      return Observable.fromPromise(this.afAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password))
        .flatMap((fbUser) => {
          this.populateUser();
          return fbUser;
        });
    } else {
      return Observable.fromPromise(this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password))
        .map(fbUser => {
          const user = new User();
          user.id = fbUser.uid;
          user.email = fbUser.email;
          user.username = credentials.username;
          this.update(user);
          return fbUser;
        })
        .flatMap((fbUser) => {
          this.populateUser();
          return fbUser;
        });
    }
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }

  // Update the user on the server (email, pass, etc)
  update(user): Observable<User> {
    return this.apiService.update({
      sql: `insert into users (id, username, email, bio, image)
            values('${user.id}', '${user.username}','${user.email}', '${user.bio}', '${user.image}')
            on duplicate key update
              username = '${user.username}',
              email = '${user.email}',
              bio = '${user.bio}',
              image = '${user.image}'
            `
    }).map(data => {
      return user;
    });
  }

}
