import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store, HotTopicService, NewsResponse, IActionBarConfig, Config } from '../../../common';
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

    constructor(
        private http: HttpClient,
        private store: Store,
        private hotTopic: HotTopicService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit() {
        if (Config.IS_MOBILE_NATIVE) {
            this.setupActionBar.isSync = true;
        }

        this.route.params.subscribe(data => {
            this.getList();
        });
    }

    getList() {
        this.hotTopic.getNewsList().subscribe(res => {
            this.newsList = res;
            this.store.set("newsList", this.newsList);
        }, err => {
            this.error = err.status + " " + err.statusText;
        });
    }
}
