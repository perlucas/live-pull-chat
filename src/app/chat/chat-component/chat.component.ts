import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core';

import { Message } from '../../Message.model';
import { MessagesService } from '../MessagesService.service';
import { Subscription } from 'rxjs';
import { NotificationService } from '../NotificationService.service';

@Component({
    selector: "app-chat",
    templateUrl: "./chat.component.html",
    styleUrls: ["./chat.component.css"]
})
export class ChatComponent implements OnInit, OnDestroy {
    messages: Message[] = [];
    messageContent: string = "";
    private subscription: Subscription;

    constructor (
        private elementReference: ElementRef,
        private messagesService: MessagesService, 
        private notificationService: NotificationService
    ) {}

    ngOnInit(): void {
        this.subscription = this.messagesService
            .getUpdatedMessagesAsObservable()
            .subscribe(list => {
                this.messages = list;
                let chatAreaDiv = this.elementReference.nativeElement.querySelector('.chat-area');
                if (chatAreaDiv.scrollHeight === chatAreaDiv.scrollTop + chatAreaDiv.offsetHeight) {
                    setTimeout(() => chatAreaDiv.scrollTo(0, chatAreaDiv.scrollHeight), 0);    
                }
            });
        this.messagesService.startLiveReloading();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    trackByMessageId (index: number, message: any): number {
        return message.id;
    }

    sendMessage(event: Event) {
        event.preventDefault();
        this.messagesService.sendNewMessage(this.messageContent);
        this.messageContent = "";
    }

    onTextAreaFocus() {
        this.notificationService.cleanNotifications();
    }
}