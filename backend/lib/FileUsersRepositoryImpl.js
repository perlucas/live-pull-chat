const Abstractions = require('../abstractions');
const fs = require('fs');

class FileUsersRepositoryImpl extends Abstractions.UsersRepository {
    #filename = './backend/users.txt'
    
    constructor() {
        super();
        if (this.fileExists()) {
            fs.unlinkSync(this.#filename);
        }
    }

    existsUser (user) {
        if (this.fileExists()) {
            let fileContent = this.getFileContent();
            let usersList = fileContent.toString().split("\n");
            return usersList.filter(u => u === user.username).length > 0;
        }
        return false;
    }

    addNewUser(user) {
        let content = this.fileExists() ? this.getFileContent() : "";
        content += `${user.username}\n`;
        fs.writeFileSync(this.#filename, content);
    }

    fileExists() {
        return fs.existsSync(this.#filename);
    }

    getFileContent() {
        return fs.readFileSync(this.#filename);
    }
}

module.exports = FileUsersRepositoryImpl;