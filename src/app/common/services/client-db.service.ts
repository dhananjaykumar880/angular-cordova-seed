import { Injectable } from '@angular/core';
import { SQLiteStore } from "cordova-plugin-nano-sqlite/lib/sqlite-adapter";
import { nSQL } from "nano-sql";
import { newsCollection, messageCollection } from "../table-mva/index";
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/forkJoin";
import 'rxjs/add/operator/toPromise'

/**
 * Database service for client side
 */
@Injectable()
export class ClientDbService {

    /**
     * Create tables in client db and create connection to db
     */
    init() {
        nSQL("news").model(newsCollection.model).views(newsCollection.view).actions(newsCollection.action)
        nSQL("message").model(messageCollection.model).views(messageCollection.view).actions(messageCollection.action)

        return nSQL().config({
            id: "AppDb",
            mode: SQLiteStore.getMode()
        }).connect();
    }

    /**
     * Get table from database
     * @param name of table
     */
    getTable(name: string) {
        return nSQL(name);
    }
}
