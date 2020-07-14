const Abstractions = require('../abstractions');

class MemoryUsersRepositoryImpl extends Abstractions.UsersRepository {
    #users;

    constructor() {
        super();
        this.#users = [];
    }

    addNewUser (user) {
        this.#users.push(user.username);
    }

    existsUser (user) {
        return this.#users.filter(u => u === user.username).length > 0;
    }
}

module.exports = MemoryUsersRepositoryImpl;