class UsersRepository {
    
    existsUser (user) { }

    addNewUser(user) { }
}

class MessagesRepository {

    getAllMessages() {  }
    
    getAllMessagesFrom(messageId) {  }
    
    addNewMessage(message, user) {  }

    getDateAsHuman() {
        const completeWithZeros = (argument) => {
            return argument > 9 ? `${argument}` :  `0${argument}`;
        };
        let now = new Date();
        let day = completeWithZeros( now.getDate() );
        let month = completeWithZeros( now.getMonth() + 1 );
        let year = now.getFullYear();
        let hour = completeWithZeros( now.getHours() );
        let minutes = completeWithZeros( now.getMinutes() );
        let seconds = completeWithZeros( now.getSeconds() );

        return `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;
    }
}

class Repository {
    #usersRepository;
    #messagesRepository;

    constructor (usersRepository, messagesRepository) {
        this.#usersRepository = usersRepository;
        this.#messagesRepository = messagesRepository;
    }

    existsUser(user) { return this.#usersRepository.existsUser(user); }

    addNewUser(user) { return this.#usersRepository.addNewUser(user); }
    
    getAllMessages() { return this.#messagesRepository.getAllMessages();}
    
    getAllMessagesFrom(messageId) { return this.#messagesRepository.getAllMessagesFrom(messageId); }
    
    addNewMessage(message, user) { return this.#messagesRepository.addNewMessage(message, user); }
}

module.exports = {
    Repository,
    UsersRepository,
    MessagesRepository
};