import { Injectable, Inject } from "@angular/core";

@Injectable()
export class Store {
    private localStorage: any;

    constructor(@Inject('WINDOW') private window: any) {
        this.localStorage = window.localStorage;
    }

    get(key: any, value?: any) {
        let ret = JSON.parse(this.localStorage.getItem(key));
        if(ret !== null) {
            return ret;
        } else {
            return value;
        }
    }

    set(key: any, value: any) {
        this.localStorage.setItem(key, JSON.stringify(value));
    }

    remove(key: any) {
        this.localStorage.removeItem(key);
    }

    clear() {
        this.localStorage.clear();
    }
}