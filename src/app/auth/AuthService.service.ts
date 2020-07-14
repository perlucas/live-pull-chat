import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { User } from '../User.model';
import { MessagesService } from '../chat/MessagesService.service';
import * as ErrorCodes from './AuthErrors.errors';

@Injectable({
    providedIn: 'root',
  })
export class AuthService {
    private currentUser: User|null;
    private authError: number;

    constructor(private http: HttpClient, private messagesService: MessagesService) {
        this.authError = 0;
        this.currentUser = null;
    }
    
    isLoggedIn () {
        return this.currentUser !== null;
    }

    isActiveUser (u: User): boolean {
        return this.currentUser.username === u.username;
    }

    attemptLoginAuthentication (user: User): Observable<User|null> {
        return new Observable((observer) => {
            if (! this.isValidUser(user)) {
                this.authError = ErrorCodes.InvalidUsernameError;
                observer.next(this.currentUser);
                observer.complete();
            } else {
                this.http.post(environment.serverHost + "/auth", user, { withCredentials: true })
                    .pipe(
                        catchError(this.handleHttpError)
                    )
                    .pipe(
                        map(this.standarizeResponse)
                    )
                    .subscribe((response: {error: boolean, data: any}) => {
                        if (response.error) {
                            this.currentUser = null;
                            this.authError = response.data ? response.data.code : -1;
                        } else {
                            this.currentUser = response.data.user;
                            this.authError = 0;
                            this.messagesService.addNewMessages(response.data.messages);
                        }
                        observer.next(this.currentUser);
                        observer.complete();
                    });
            }

            return {
                unsubscribe() {}
            };
        });
    }

    attemptSessionAuthentication (): Observable<User|null> {
        return new Observable((observer) => {
            this.http.get(environment.serverHost + "/auth/session", { withCredentials: true })
                .pipe(
                    catchError(this.handleHttpError)
                )
                .subscribe((response: { error: boolean, data: any }) => {
                    if (response.error) {
                        this.currentUser = null;
                        this.authError = response.data ? response.data.code : -1;
                    } else {
                        this.currentUser = response.data.user;
                        this.authError = 0;
                        this.messagesService.addNewMessages(response.data.messages);
                    }
                    observer.next(this.currentUser);
                    observer.complete();
                });
                
            return {
                unsubscribe() {}
            };
        });
    }
    
    get errorCode() : number {
        return this.authError;
    }
    
    private isValidUser(user): boolean {
        const matchesPattern = /^[a-zA-Z]+[a-zA-Z0-9_]*$/.test(user.username);
        const matchesMinSize = user.username.length >= 5;
        return matchesPattern && matchesMinSize;
    }

    private handleHttpError(error: HttpErrorResponse): Observable<{ error: boolean, data: any }> {
        if (error.error instanceof ErrorEvent) {
            console.error("Something went wrong with the server: " + error.message);
        }

        return of({ 
            error: true, 
            data: (error.error instanceof ErrorEvent) ? null : error.error.data }
        );
    }

    private standarizeResponse (response: any) {
        if (response.error === undefined) {
            return {
                error: false,
                data: response.data
            };
        }
        return response;
    }
}