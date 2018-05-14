import { Injectable, Inject } from "@angular/core";

/**
 * Store service
 * used for persist application data in key value pair
 */
@Injectable()
export class Store {
    private localStorage: any;

    /**
     * Constructor with service injection
     * @param window 
     */
    constructor(@Inject('WINDOW') private window: any) {
        this.localStorage = window.localStorage;
    }

    /**
     * get data of given key
     * @param key 
     * @param value 
     */
    get(key: any, value?: any) {
        let ret = JSON.parse(this.localStorage.getItem(key));
        if(ret !== null) {
            return ret;
        } else {
            return value;
        }
    }

    /**
     * set value on given key
     * @param key 
     * @param value 
     */
    set(key: any, value: any) {
        this.localStorage.setItem(key, JSON.stringify(value));
    }

    /**
     * remove given key
     * @param key 
     */
    remove(key: any) {
        this.localStorage.removeItem(key);
    }

    /**
     * clear all available keys
     */
    clear() {
        this.localStorage.clear();
    }
}
