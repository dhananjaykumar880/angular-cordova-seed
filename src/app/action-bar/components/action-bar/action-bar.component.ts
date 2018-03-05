import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Store, EventHandler, IActionBarConfig } from '../../../common';

const defaultConfig: IActionBarConfig = {
  isBack: false,
  back: {
    isBack: false,
    isVisible: true
  },
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
  moduleId: module.id,
  selector: 'App-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})

export class ActionBarComponent implements OnInit, OnDestroy {
  config: IActionBarConfig;
  isConnectionAvail: boolean = false;
  @Input() setupActionBar: IActionBarConfig;

  constructor(
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private event: EventHandler,
    private store: Store
  ) {
  }

  ngOnInit() {
    this.config = { ...defaultConfig, ...this.setupActionBar };
    this.route.params.subscribe(data => {
      this.config.isSync = this.config.isSync && !data.sync;
    });
    document.addEventListener('backbutton', this.onBack, false);
  }

  onBack() {
    this.location.back();
    this.event.emit("isBack", true);
  }

  onHome() {
    this.router.navigate(['/home']);
  }

  onLogout() {

  }

  onSync() {
    this.store.set("isSyncAvailable", true);
    this.router.navigate(['/home', 'sync']);
  }

  ngOnDestroy() {
    document.removeEventListener('backbutton', this.onBack, false);
  }
}