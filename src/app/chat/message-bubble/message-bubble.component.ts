import { Component, Input } from '@angular/core';

import { Message } from '../../Message.model';
import { AuthService } from 'src/app/auth/AuthService.service';

@Component({
    selector: 'message-bubble',
    templateUrl: './message-bubble.component.html',
    styleUrls: ['./message-bubble.component.css']
})
export class MessageBubbleComponent {
    @Input() message: Message;

    constructor (private auth: AuthService) {}
    
    private isActiveUserMessage(): boolean {
        return this.auth.isActiveUser(this.message.user);
    }

    public get cssFloat() : string {
        return this.isActiveUserMessage() ? "right" : "left";
    }

    
    public get cssBgColor() : string {
        return this.isActiveUserMessage() ? "#beb0cd" : "#f3e7e8";
    }
    
    public get messageUsername() : string {
        return this.isActiveUserMessage() ? "" : this.message.user.username;
    }
    
}