import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/from';

/**
 * EventHandler service
 * used for spread an event from any component and will be accessible from any component
 */
@Injectable()
export class EventHandler {
    private listeners: Object = {};
    private eventsSubject: any;
    private events: any;

    /**
     * subscribe events and fire callback based on name
     */
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

    /**
     * listen given event name
     * @param name is event name
     * @param listener is callback
     */
    on(name, listener) {
        if (!this.listeners[name]) {
            this.listeners[name] = [];
        }

        this.listeners[name].push(listener);
    }

    /**
     * remove given event name from listeners object
     */
    off(name) {
        if (this.listeners[name]) {
            delete this.listeners[name];
        }
    }

    /**
     * emit given event name with given arguments
     * @param name is event name
     * @param args will be receive in callback
     */
    emit(name, ...args) {
        this.eventsSubject.next({
            name,
            args
        });
    }
}
