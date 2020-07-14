import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { User } from '../../User.model';
import { AuthService } from '../AuthService.service';
import { Observer } from 'rxjs';

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: [ "./login.component.css" ]
})
export class LoginComponent implements OnInit {
    authenticating: boolean = false;

    constructor(private auth: AuthService, private router: Router) {}

    ngOnInit(): void {
        this.authenticating = true;
        this.auth.attemptSessionAuthentication().subscribe(this.getAsAuthenticationObserver());
    }
    
    onSubmit(f: NgForm): void {
        let user: User = {
            username: f.value.nickname,
            color: f.value.color
        };
        this.authenticating = true;
        this.auth.attemptLoginAuthentication(user).subscribe(this.getAsAuthenticationObserver());
    }

    private getAsAuthenticationObserver(): Observer<User|null> {
        return {
            next: user => {
                if (user !== null) { this.router.navigate(["/chat"]); }
            },

            complete: () => this.authenticating = false,

            error: (err) => {
                console.error(err);
                this.authenticating = false;
            }
        };
    }

    get getDefaultSelectedColor(): string { return "green"; }

    getColorsToSelect(): any[] {
        return [
            { name: "Verde", color: "green" },
            { name: "Rojo", color: "red" },
            { name: "Azul", color: "blue" },
            { name: "Negro", color: "black" },
            { name: "Naranja", color: "orange" },
        ];
    }
}