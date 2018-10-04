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
        this.localStorage = new localStore();
    }

    private getSource(fromLocal?: boolean) {
        return fromLocal ? this.localStorage : this.window.localStorage;
    }

    /**
     * get data of given key
     * @param key 
     * @param value 
     */
    get(key: any, value?: any, fromLocal?: boolean) {
        let source = this.getSource(fromLocal),
            ret = JSON.parse(source.getItem(key));
        if (ret !== null) {
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
    set(key: any, value: any, fromLocal?: boolean) {
        let source = this.getSource(fromLocal);
        source.setItem(key, JSON.stringify(value));
    }

    /**
     * remove given key
     * @param key 
     */
    remove(key: any, fromLocal?:boolean) {
        let source = this.getSource(fromLocal);
        source.removeItem(key);
    }

    /**
     * clear all available keys
     */
    clear(fromLocal?:boolean) {
        let source = this.getSource(fromLocal);
        source.clear();
    }
}

class localStore {
    private store: Object = {};

    getItem(key: any) {
        return this.store[key] || null;
    }

    setItem(key: any, value: any) {
        this.store[key] = value;
    }

    removeItem(key: any) {
        delete this.store[key];
    }

    clear() {
        this.store = {};
    }
}
