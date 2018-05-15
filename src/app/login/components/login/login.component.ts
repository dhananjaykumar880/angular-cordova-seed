import { Component, OnInit } from '@angular/core';
import { Store, IActionBarConfig, LoginService, Config } from '../../../common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'App-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error: string;
  error_description: string;
  inLogin: boolean = false;
  setupActionBar: IActionBarConfig = {
    title: {
      isTextTitle: true,
      text: 'application.login'
    },
    isLogout: false
  };

  /**
   * Constructor with service injection
   * @param store 
   * @param loginService 
   * @param route 
   */
  constructor(
    private store: Store,
    private loginService: LoginService,
    private route: ActivatedRoute
  ) { }

  /**
   * subscribe params and queryparams from route
   */
  ngOnInit() {
    let callBack = data => {
      this.inLogin = false;
      this.error = this.route.snapshot.queryParams.error || 'login.error';
      this.error_description = this.route.snapshot.queryParams.error_description || 'login.description';
    }
    
    this.route.params.subscribe(callBack);
    this.route.queryParams.subscribe(callBack);
  }

  /**
   * open login page on login button
   */
  onLogin() {
    this.inLogin = true;
    this.loginService.doLogin();
  }
}
