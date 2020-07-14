import { Component } from '@angular/core';

import { AuthService } from '../AuthService.service';
import * as ErrorCodes from '../AuthErrors.errors';

@Component({
    selector: 'login-error',
    templateUrl: './login-error.component.html',
    styleUrls: ['./login-error.component.css']
})
export class LoginErrorComponent {
    errorCodes = ErrorCodes;

    constructor(public auth: AuthService) {}

    onShowUsernameHelp(event: Event): void {
        const message = `El nickname debe cumplir los siguientes requisitos:
        >> Debe comenzar con una letra
        >> Debe contener al menos 5 caracteres alfanuméricos
        >> No puede contener espacios o algún otro caracter especial, excepto "_"`;
        alert(message);
        event.preventDefault();
    }
}