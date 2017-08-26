import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { User } from '../_models/user.model';

// taken from http://jasonwatmore.com/post/2016/09/29/angular-2-user-registration-and-login-example-tutorial
@Injectable()
export class UserService {
    constructor(private http: Http) {};

    getAll() {
        return this.http.get('/api/users', this.jwt())
        .map((data) => data.json());
    }

    getById(id: number) {
        return this.http.get('/api/users/' + id, this.jwt())
        .map((data) => data.json());
    }

    create(user: User) {
        return this.http.post('/api/users', user, this.jwt())
        .map((data) => data.json());
    }

    update(user: User) {
        return this.http.put('/api/users/' + user.id, user, this.jwt())
        .map((data) => data.json());
    }

    delete(id: number) {
        return this.http.delete('/api/users/' + id, this.jwt())
        .map((data) => data.json());
    }

    // private helper methods
    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}
