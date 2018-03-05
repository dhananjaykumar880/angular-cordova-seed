import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/from';

@Injectable()
export class EventHandler {
    private listeners: Object = {};
    private eventsSubject: any;
    private events: any;

    constructor() {
        this.eventsSubject = new Subject();
        this.events = Observable.from(this.eventsSubject);

        this.events.subscribe(
            ({ name, args }) => {
                if (this.listeners[name]) {
                    for (let listener of this.listeners[name]) {
                        listener(...args);
                    }
                }
            });
    }

    on(name, listener) {
        if (!this.listeners[name]) {
            this.listeners[name] = [];
        }

        this.listeners[name].push(listener);
    }

    off(name) {
        if (this.listeners[name]) {
            delete this.listeners[name];
        }
    }

    emit(name, ...args) {
        this.eventsSubject.next({
            name,
            args
        });
    }
}