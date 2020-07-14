const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config({ path: 'backend/.env' });

const Repository = require('./abstractions').Repository;
const UsersRepo = require('./lib/MemoryUsersRepositoryImpl');
// const MessagesRepo = require('./lib/MemoryMessagesRepositoryImpl');
// const UsersRepo = require('./lib/FileUsersRepositoryImpl');
// const MessagesRepo = require('./lib/FileMessagesRepositoryImpl');
const MessagesRepo = require('./lib/ChunksBasedMessagesRepository');

var repository = new Repository(
    new UsersRepo(),
    new MessagesRepo()
);

var app = express();

app.use((req, res, next) => {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    console.log(`Memory usage is ${Math.round(used * 100) / 100} MB`);
    next();
});

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: true,
        saveUninitialized: false
    })
);

app.use((req, res, next) => {
    const client = process.env.CLIENT;
    res.header("Access-Control-Allow-Origin", client);
    res.header("Access-Control-Request-Method", "POST,GET");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// Authenticate user through stored session credentials
app.get("/auth/session", function (req, res) {
    if (req.session.user) {
        res.status(200).json({
            message: "User authenticated through session",
            data: { 
                user: req.session.user,
                messages: repository.getAllMessages()
            }
        })
    } else {
        res.status(404).json({
            message: "User doesn't have an active session",
            data: { code: 103 }
        });
    }
});

// Store user credentials in session
app.post("/auth", bodyParser.json(), function (req, res) {
    let user = {
        username: req.body.username,
        color: req.body.color
    };

    if (repository.existsUser(user)) {
        res.status(400).json({
            message: "The user already exists",
            data: { code: 102, user: user }
        });
    } else {
        req.session.user = user;
        repository.addNewUser(user);
        res.status(200).json({
            message: "User authenticated correctly",
            data: {
                user: user,
                messages: repository.getAllMessages()
            }
        });
    }
});

app.post("/messages", bodyParser.json(), function (req, res) {
    if (! req.session.user) {
       return res.status(401).json({
           message: "Forbidden action",
           data: { code: 103 }
       });
   }

   repository.addNewMessage(req.body.content, req.session.user);
   res.status(200).json({
       message: "New message added successfully",
       data: {
           user: req.session.user,
           messages: repository.getAllMessages()
       }
   });
});

app.get("/messages", function (req, res) {
    if (! req.session.user) {
        return res.status(401).json({
            message: "Forbidden action",
            data: { code: 103 }
        });
    }

    let messages = req.query.from 
        ? repository.getAllMessagesFrom(req.query.from)
        : repository.getAllMessages();
    
    res.status(200).json({
        message: "Messages retrieved",
        data: {
            user: req.session.user,
            messages: messages
        }
    });
});

app.listen(3000, () => console.log("Listening for incoming requests!"));