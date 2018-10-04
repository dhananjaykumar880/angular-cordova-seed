import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class PopEventService {

    private popState: boolean = false;
    private urlHistory: string[] = [];
    private popSubject: Subject<boolean> = new Subject();

    constructor(private location: Location, private router: Router) {

        location.subscribe(event => {
            let fwd = false;
            if (this.urlHistory.lastIndexOf(event.url)) {
                this.urlHistory.push(event.url);
            }
            else {
                fwd = true;
                this.urlHistory.pop();
            }
            this.popState = true;
            this.popSubject.next(fwd);
        })

        router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                if (!this.popState)
                    this.urlHistory = [this.router.url];
                this.popState = false;
            }
        })
    }

    popEvent$() {
        return this.popSubject.asObservable();
    }
}