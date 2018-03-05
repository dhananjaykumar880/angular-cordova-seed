import { Injectable } from '@angular/core';
import { SQLiteStore } from "cordova-plugin-nano-sqlite/lib/sqlite-adapter";
import { nSQL } from "nano-sql";
import { newsCollection } from "../table-mva/index";
import { Observable } from 'rxjs/Observable';
import "rxjs/add/observable/forkJoin";
import 'rxjs/add/operator/toPromise'

@Injectable()
export class ClientDbService {

    init() {
        nSQL("news").model(newsCollection.model).views(newsCollection.view).actions(newsCollection.action)

        return nSQL().config({
            id: "AppDb",
            mode: SQLiteStore.getMode()
        }).connect();
    }

    getTable(name: string) {
        return nSQL(name);
    }
}