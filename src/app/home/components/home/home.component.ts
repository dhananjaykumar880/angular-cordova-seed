import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, IActionBarConfig, Config, HttpDataService } from '../../../common';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import "rxjs/add/operator/takeUntil";

@Component({
    selector: 'App-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit, OnDestroy {
    private unsubscribe: Subject<void> = new Subject();
    newsList: any;
    error: string;
    setupActionBar: IActionBarConfig = {
        isSideBar: true,
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

        this.route.params
            .takeUntil(this.unsubscribe)
            .subscribe(data => {
                this.getList();
            });
    }

    /**
     * get news from hot topic service
     */
    getList() {
        this.httpData.getNewsList()
            .takeUntil(this.unsubscribe)
            .subscribe(res => {
                this.newsList = res;
                this.store.set("newsList", this.newsList);
            }, err => {
                this.error = err.status + " " + err.statusText;
            });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
