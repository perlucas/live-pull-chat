# Live Pull Chat

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.1.

Live Chat using "Pull" mechanism. User messages are requested on a frequency of 2 seconds between each request.

Different users and messages repositories have been created for increasing the backend storage performance by optimizing memory usage. This is done by using file storage instead of memory and chunks based mechanisms.

## Angular development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## NodeJS backend server

Run `npm run server` for the backend server (which holds the API). It uses `nodemon` for reloading the server after a change has been made.

