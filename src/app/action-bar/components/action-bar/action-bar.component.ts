import { Component, OnInit, Input, OnDestroy, NgZone } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Store, EventHandler, IActionBarConfig, PopEventService } from '../../../common';

interface Navigator {
  connection: any
}
declare let navigator: Navigator;
declare let Connection;
const defaultConfig: IActionBarConfig = {
  isBack: false,
  isSideBar: false,
  title: {
    isHomeTitle: false,
    isTextTitle: false,
    text: ""
  },
  isHome: false,
  isSync: false,
  isLogout: false,
  isClose: false
};

@Component({
  selector: 'App-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})

export class ActionBarComponent implements OnInit, OnDestroy {
  config: IActionBarConfig;
  isConnectionAvail: boolean = false;
  @Input() setupActionBar: IActionBarConfig;
  subscriber: any;

  /**
   * Constructor with service injection
   * @param location 
   * @param router 
   * @param route 
   * @param event 
   * @param store 
   */
  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private event: EventHandler,
    private store: Store,
    private zone: NgZone,
    private popEvent: PopEventService
  ) {
  }

  /**
   * update actionbar configs and listen backbutton
   */
  ngOnInit() {
    this.config = { ...defaultConfig, ...this.setupActionBar };
    // this.route.params.subscribe(data => {
    //   this.config.isSync = this.config.isSync && !data.sync;
    // });
    if (this.config.isSync) {
      this.config.isSync = navigator.connection.type !== Connection.NONE;
    }
    document.addEventListener("offline", this.offline.bind(this), false);
    document.addEventListener("online", this.online.bind(this), false);
    document.addEventListener('backbutton', this.onBack.bind(this), false);

    this.subscriber = this.popEvent.popEvent$().subscribe(isFwd => {
      if(!isFwd) {
        this.event.emit("isBack", true);
      }
    })
  }

  /**
   * show sync on online mode
   */
  online() {
    this.zone.run(() => {
      this.config.isSync = true;
    });
  }

  /**
   * hide sync on offline mode
   */
  offline() {
    this.zone.run(() => {
      this.config.isSync = false;
    });
  }

  /**
   * go back on back button click
   */
  onBack() {
    this.location.back();
    this.event.emit("isBack", true);
  }

  onSideBar() {
    this.event.emit("isSideBar");
  }


  /**
   * go home on home button click
   */
  onHome() {
    this.router.navigate(['/home']);
  }

  /**
   * logout user on logout button click
   */
  onLogout() {

  }

  /**
   * sync data from server on sync button click
   */
  onSync() {
    this.store.set("isSyncAvailable", true);
    this.router.navigate(['/home']);
  }

  /**
   * remove back button listener
   */
  ngOnDestroy() {
    document.removeEventListener('offline', this.offline, false);
    document.removeEventListener('online', this.online, false);
    document.removeEventListener('backbutton', this.onBack, false);
    this.subscriber.unsubscribe();
  }
}
