import { Component, Input } from '@angular/core';
import { Config } from '../../../common';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SideMenuComponent {
  @Input() container;
  version = Config.version;
  lists: Array<Object> = [
    {
      "display": "Disclaimer",
      "route": ['']
    }
  ]

  onClose() {
    this.container.toggle();
  }

}
