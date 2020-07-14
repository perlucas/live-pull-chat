import { Injectable, OnDestroy } from '@angular/core';
import { Subject, of } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Message } from '../Message.model';
import { NotificationService } from './NotificationService.service';

@Injectable({ providedIn: 'root' })
export class MessagesService implements OnDestroy {
    
    private messages: Message[] = [];
    private lastMessage: Message;
    private interval: number;
    private updatedMessages$ = new Subject<Message[]>();

    constructor(private http: HttpClient, private notifier: NotificationService) {}

    getUpdatedMessagesAsObservable() { return this.updatedMessages$.asObservable(); }

    addNewMessages(messages: Message[]) {
        const initialNumberOfMessages = this.messages.length;

        if (this.messages.length) {
            for (let m of messages)
                if (m.id > this.lastMessage.id)
                    this.messages.push(m);
        } else {
            this.messages = messages;
        }

        if (this.messages.length) {
            this.lastMessage = this.messages[this.messages.length - 1];
        }
        
        this.updatedMessages$.next([...this.messages]);
        this.notifier.notifyNewMessages(this.messages.length - initialNumberOfMessages);
    }

    startLiveReloading() {
        const fn = ( () => this.fetchMessages() ).bind(this);
        this.interval = setInterval(fn, 2000);
    }

    ngOnDestroy(): void {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    sendNewMessage(content: string): void {
        this.http.post(environment.serverHost + "/messages", { content }, { withCredentials: true })
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    console.error("An error ocurred: " + err.message + " Code: " + err.status);
                    return of();
                })
            )
            .subscribe((response: any) => this.addNewMessages(response.data.messages));
    }

    private fetchMessages() {

        let query = this.lastMessage ? `?from=${this.lastMessage.id}` : "";

        this.http.get(environment.serverHost + "/messages" + query, { withCredentials: true })
            .pipe(
                catchError((err: HttpErrorResponse) => {
                    console.error("An error ocurred: " + err.message + " Code: " + err.status);
                    return of();
                })
            )
            .subscribe((response: any) => this.addNewMessages(response.data.messages));
    }
}