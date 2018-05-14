import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from '../utils';
import { SyncService } from "./sync.service";
import 'rxjs/add/operator/map';
import { Store } from '../utils/index';
import { FileService } from './file.service';
import { LoadingService } from './loader.service';

/**
 * Interface for news
 */
export interface NewsResponse {
    news: Object[],
    infoNews: Object[]
}

/**
 * HttpDataService
 * a service for get latest news
 */
@Injectable()
export class HttpDataService {

    /**
     * Constructor with service injection
     * @param http 
     * @param syncService 
     * @param store 
     * @param fileService 
     * @param spinner 
     */
    constructor(
        private http: HttpClient,
        private syncService: SyncService,
        private store: Store,
        private fileService: FileService,
        private spinner: LoadingService
    ) { }

    /**
     * return required headers
     */
    private createRequestHeader() {
        let headers = new HttpHeaders({});
        headers = headers.append("Content-Type", "application/json");
        return headers;
    }

    /**
     * return news from server and from local device.
     */
    getNewsList() {
        return this.store.get("isSyncAvailable", true) ? this.getNewsListFromServer() : this.getNewsListFromApp()
    }

    /**
     * return news form local device
     */
    getNewsListFromApp() {
        console.log("Application is loading Offline...");
        return this.http.get<NewsResponse>(Config.FILE_ROOT_URL + 'news.json')
            .map(result => result.news);
    }

    /**
     * return news form server
     * and download all assets from server and save to persistent location in touch device
     */
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
                        this.fileService.cleanOldAssetIfAvailable(this.syncService.synced);
                        this.spinner.onFinished("syncing");
                    });
                }
                return result.news;
            });
    }
}
