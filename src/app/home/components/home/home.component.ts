import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store, NewsResponse, IActionBarConfig, Config, HttpDataService } from '../../../common';
import { ActivatedRoute } from '@angular/router';

@Component({
    moduleId: module.id,
    selector: 'App-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
    newsList: any;
    error: string;
    setupActionBar: IActionBarConfig = {
        title: {
            isHomeTitle: true
        }
    };

    /**
     * Constructor with service injection
     * @param http 
     * @param store 
     * @param httpData 
     * @param route 
     */
    constructor(
        private http: HttpClient,
        private store: Store,
        private httpData: HttpDataService,
        private route: ActivatedRoute,
    ) { }

    /**
     * subscribe route params for get news
     */
    ngOnInit() {
        if (Config.IS_MOBILE_NATIVE) {
            this.setupActionBar.isSync = true;
        }

        this.route.params.subscribe(data => {
            this.getList();
        });
    }

    /**
     * get news from hot topic service
     */
    getList() {
        this.httpData.getNewsList().subscribe(res => {
            this.newsList = res;
            this.store.set("newsList", this.newsList);
        }, err => {
            this.error = err.status + " " + err.statusText;
        });
    }
}
