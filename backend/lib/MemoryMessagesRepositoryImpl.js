const Abstractions = require('../abstractions');

class MemoryMessagesRepositoryImpl extends Abstractions.MessagesRepository {
    #messages;

    constructor () {
        super();
        this.#messages = [];
    }

    getAllMessages() {
        return this.#messages;
    }

    getAllMessagesFrom(messageId = 0) {
        return this.#messages.filter(m => m.id >= messageId);
    }

    addNewMessage(content, user) {
        let newMessage = {
            id: this.#messages.length + 1,
            content: content,
            timestamp: this.getDateAsHuman(),
            user: user
        };
        this.#messages.push(newMessage);
    }
}

module.exports = MemoryMessagesRepositoryImpl;