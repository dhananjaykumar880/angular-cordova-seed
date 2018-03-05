import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../utils';
import { SyncService } from "./sync.service";
import 'rxjs/add/operator/map';
import { Store } from '../utils/index';
import { FileService } from './file.service';
import { LoadingService } from './loader.service';

export interface NewsResponse {
    news: Object[],
    infoNews: Object[]
}

@Injectable()
export class HotTopicService {
    constructor(
        private http: HttpClient,
        private syncService: SyncService,
        private store: Store,
        private fileService: FileService,
        private spinner: LoadingService
    ) { }

    private createRequestHeader() {
        let headers = new HttpHeaders({});
        headers = headers.append("Content-Type", "application/json");
        return headers;
    }

    getNewsList() {
        return this.store.get("isSyncAvailable", true) ? this.getNewsListFromServer() : this.getNewsListFromApp()
    }

    getNewsListFromApp() {
        console.log("Application is loading Offline...");
        return this.http.get<NewsResponse>(Config.FILE_ROOT_URL + 'news.json')
            .map(result => result.news);
    }

    getNewsListFromServer() {
        let headers = this.createRequestHeader();

        console.log("Application is loading Online...");
        return this.http.get<NewsResponse>(Config.NEWS_URL, { headers: headers })
            .map(result => {
                if (Config.IS_MOBILE_NATIVE) {
                    this.spinner.onStarted("syncing");
                    this.syncService.loadAndReplaceAssetsForAll(result.news).then(news => {
                        result.news = news;
                        this.store.set("newsList", news);
                        this.store.set("isSyncAvailable", false);
                        this.fileService.saveToApp("news.json", JSON.stringify(result));
                        this.spinner.onFinished("syncing");
                    });
                }
                return result.news;
            });
    }
}