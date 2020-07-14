const Abstractions = require('../abstractions');
const fs = require('fs');

class FileMessagesRepositoryImpl extends Abstractions.MessagesRepository {
    #filename = './backend/messages.txt';
    #lastMessageId;

    constructor() {
        super();
        this.#lastMessageId = -1;
        if (fs.existsSync(this.#filename)) {
            fs.unlinkSync(this.#filename);
        }
    }

    getAllMessages() { 
        return this.loadMessagesFile();
    }
    
    getAllMessagesFrom(messageId) { 
        if (messageId === this.#lastMessageId) {
            return [];
        }
        let messages = this.getAllMessages();
        return messages.filter(m => m.id >= messageId);
    }
    
    addNewMessage(content, user) { 
        let messages = this.getAllMessages();
        this.#lastMessageId = messages.length + 1;
        messages.push({
            id: messages.length + 1,
            content: content,
            timestamp: this.getDateAsHuman(),
            user: user
        });
        fs.writeFileSync(this.#filename, JSON.stringify(messages));
    }

    loadMessagesFile() {
        return fs.existsSync(this.#filename)
            ? JSON.parse(fs.readFileSync(this.#filename))
            : [];
    }
}

module.exports = FileMessagesRepositoryImpl;