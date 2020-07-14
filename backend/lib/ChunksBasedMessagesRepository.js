const fs = require('fs');
const Abstractions = require('../abstractions');

const CHUNK_SIZE = 5;
const CHUNK_SAVING_FREQUENCY = 1000 * 60 * 2; // 2 minutes

class Chunk {

    getMessages() {  }

    addNewMessage(message) {  }

    canStoreMessage() {  }
}

class ArrayBasedChunk extends Chunk {

    #messages;

    constructor() {
        super();
        this.#messages = [];
    }

    getMessages() { return this.#messages; }

    addNewMessage(message) { this.#messages.push(message); }

    canStoreMessage() { return this.#messages.length < CHUNK_SIZE; }
    
}

class ProxyChunk extends Chunk {
    #filename;
    #chunk;
    #countMessages;
    #timeoutId;

    constructor() {
        super();
        let today = new Date();
        this.#filename = './backend/chunk_' + today.getDate() + today.getMonth() + today.getTime() + '.txt';
        this.#countMessages = 0;
    }

    loadChunkFromFile() {
        const saveChunkCallback = () => {
            let data = JSON.stringify(this.#chunk.getMessages());
            fs.writeFile(this.#filename, data, () => {
                this.#chunk = null;
                this.#timeoutId = null;
                console.log("Chunk " + this.#filename + " saved!");
            });
        };

        if (this.#chunk) {
            clearTimeout(this.#timeoutId);
            this.#timeoutId = setTimeout(saveChunkCallback.bind(this), CHUNK_SAVING_FREQUENCY);
            return;
        }

        this.#chunk = new ArrayBasedChunk();
        if (fs.existsSync(this.#filename)) {
            let messages = JSON.parse(fs.readFileSync(this.#filename))
            messages.forEach(m => this.#chunk.addNewMessage(m));
        }
        
        this.#timeoutId = setTimeout(saveChunkCallback.bind(this), CHUNK_SAVING_FREQUENCY);

    }

    getMessages() {
        this.loadChunkFromFile();
        return this.#chunk.getMessages();
    }
    
    addNewMessage(message) {
        this.loadChunkFromFile();
        this.#chunk.addNewMessage(message);
        this.#countMessages ++;
    }
    
    canStoreMessage() { return this.#countMessages < CHUNK_SIZE; }

}

class ChunksBasedMessagesRepository extends Abstractions.MessagesRepository {
    #chunks;
    #counter;

    constructor() {
        super();
        this.#chunks = [];
        this.#counter = 0;
    }
    
    getAllMessages() {
        let messages = [];
        this.#chunks.forEach(chunk => chunk.getMessages().forEach(message => messages.push(message)));
        return messages;
    }
    
    getAllMessagesFrom(messageId) {
        let chunkIndex = Math.floor(messageId / CHUNK_SIZE);
        let messages = [];
        for (let i = chunkIndex; i < this.#chunks.length; i++) {
            this.#chunks[i].getMessages()
                .filter(message => message.id >= messageId)
                .forEach(message => messages.push(message));
        }
        return messages;
    }
    
    addNewMessage(content, user) {
        let message = {
            id: this.#counter,
            timestamp: this.getDateAsHuman(),
            content: content,
            user: user
        };
        let responsibleChunk;
        
        if (this.#chunks.length === 0) {
            this.#chunks.push(new ProxyChunk());
        }
        
        responsibleChunk = this.#chunks[this.#chunks.length - 1];

        if (! responsibleChunk.canStoreMessage()) {
            responsibleChunk = new ProxyChunk();
            this.#chunks.push(responsibleChunk);
        }

        responsibleChunk.addNewMessage(message);
        
        this.#counter ++;
    }
}

module.exports = ChunksBasedMessagesRepository;