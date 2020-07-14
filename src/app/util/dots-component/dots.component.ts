import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-dots',
    template: `<span>{{dots}}</span>`
})
export class DotsComponent implements OnInit, OnDestroy {
    dots: string = "...";
    private intervalId: number = 0;
    
    updateDots(): void {
        if (this.dots.length === 3) {
            this.dots = "";
            return;
        }
        this.dots += ".";
    }

    ngOnInit(): void {
        const fn = () => {
            this.updateDots();
        };
        this.intervalId = setInterval(fn.bind(this), 500);
    }
    
    ngOnDestroy(): void {
        if (this.intervalId !== 0) {
            clearInterval(this.intervalId);
        }
    }
}