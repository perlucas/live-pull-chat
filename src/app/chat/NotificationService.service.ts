import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NotificationService {
    private isPlayingAudio: boolean = false;

    notifyNewMessages (numberOfMessagesReceived: number): void {
        if (! numberOfMessagesReceived) {
            return;
        }
        
        if (document.hasFocus()) {
            return this.cleanNotifications();
        }
        
        let messageText = numberOfMessagesReceived === 1 ? 'mensaje nuevo' : 'mensajes nuevos';
        document.title = `${numberOfMessagesReceived} ${messageText}!`;
        this.playNotificationAudio()
    }

    cleanNotifications() {
        document.title = "Live Pull Chat";
    }

    private playNotificationAudio(): void {
        if (this.isPlayingAudio) {
            return;
        }
        this.isPlayingAudio = true;
        let audioPlayer = new Audio('../../assets/piece-of-cake.mp3');
        audioPlayer.play().then(() => {
            setTimeout(() => this.isPlayingAudio = false, 2000);
        });
    }
}