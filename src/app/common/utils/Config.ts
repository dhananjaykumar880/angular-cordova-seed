import * as Hashes from "jshashes";
import { version } from '../../../../package.json';

export interface IPlatforms {
    WEB: string;
    MOBILE_NATIVE: string;
}

export interface IApi {
    OAUTH_HOST: string,
    OAUTH_CLIENTID: string,
    OAUTH_SECRET: string,
    OAUTH_SCOPES: string,
    OAUTH_REDIRECT_URI(): string,
    BASE_URL: string,
}

export class Config {

    constructor() { }

    public static get version(): string {
        return version;
    }
    public static LOGIN_LOCAL = false;
    public static LOGIN_CONFIG = {
        USER_CONTEXT: '000001C'
    };

    private static sha256base64urlEncode(s) {
        let SHA256 = new Hashes.SHA256; // new SHA256 instance
        s = SHA256.b64(s);
        s = s.split('=')[0]; // Remove any trailing '='s
        s = s.replace(/\+/g, '-'); // 62nd char of encoding
        s = s.replace(/\//g, '_'); // 63rd char of encoding
        return s;
    };

    private static randomString = function (length) {
        let s = '',
            possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';

        for (let i = 0; i < length; i++) {
            s += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return s;
    };

    public static DEFAULT_SETTINGS = {
        "authenticated": true,
        // "force:newsList": null,
        // "isSyncAvailable": true
    };
    public static DEFAULT_SETTINGS_MOBILE = {
        // "authenticated": true,
    };

    public static MOBILE_ORIGIN: string = 'myapp:/';
    public static FILE_ROOT_URL: string = 'cdvfile://localhost/library-nosync/';

    // supported platforms
    public static PLATFORMS: IPlatforms = {
        WEB: 'web',
        MOBILE_NATIVE: 'mobile_native'
    };

    // current target (defaults to web)
    public static PLATFORM_TARGET: string = Config.PLATFORMS.WEB;

    public static get IS_WEB(): boolean {
        return Config.PLATFORM_TARGET === Config.PLATFORMS.WEB;
    }

    public static get IS_MOBILE_NATIVE(): boolean {
        return Config.PLATFORM_TARGET === Config.PLATFORMS.MOBILE_NATIVE;
    }

    public static APP_TEST: IApi = {
        OAUTH_HOST: '',
        OAUTH_CLIENTID: '',
        OAUTH_SECRET: '',
        OAUTH_SCOPES: '',
        OAUTH_REDIRECT_URI() {
            return Config.MOBILE_ORIGIN + 'login';
        },
        BASE_URL: ''
    }

    public static APP_PROD: IApi = {
        OAUTH_HOST: '',
        OAUTH_CLIENTID: '',
        OAUTH_SECRET: '',
        OAUTH_SCOPES: '',
        OAUTH_REDIRECT_URI() {
            return Config.MOBILE_ORIGIN + 'login';
        },
        BASE_URL: ''
    }

    public static WEB: IApi = {
        OAUTH_HOST: '',
        OAUTH_CLIENTID: '',
        OAUTH_SECRET: '',
        OAUTH_SCOPES: '',
        OAUTH_REDIRECT_URI() {
            return window.location.origin + '/login';
        },
        BASE_URL: '/api'
    }

    // default server
    public static API: IApi = Config.WEB;

    public static CODE = '';
    private static CODE_CHALLANGE_METHOD = 'S256';
    public static CODE_VERIFIER = Config.randomString(43);
    private static CODE_CHALLANGE = Config.sha256base64urlEncode(Config.CODE_VERIFIER);

    public static get AUTHORIZE_URL(): string {
        return encodeURI(
            Config.API.OAUTH_HOST + 'oauth/authorize?response_type=code'
            + '&redirect_uri=' + Config.API.OAUTH_REDIRECT_URI()
            + '&scope=' + Config.API.OAUTH_SCOPES
            + '&client_id=' + Config.API.OAUTH_CLIENTID
            + '&code_challenge=' + Config.CODE_CHALLANGE
            + '&code_challenge_method=' + Config.CODE_CHALLANGE_METHOD
        )
    };

    public static TOKEN_URL: string = Config.API.OAUTH_HOST + 'oauth/token';
    public static get TOKEN_BODY(): string {
        return encodeURI(
            'grant_type=authorization_code'
            + '&redirect_uri=' + Config.API.OAUTH_REDIRECT_URI()
            + '&client_id=' + Config.API.OAUTH_CLIENTID
            + '&code=' + Config.CODE
            + '&code_verifier=' + Config.CODE_VERIFIER
        )
    };

    public static NEWS_URL: string = Config.API.BASE_URL + "";
    public static ASSET_URL: string = Config.API.BASE_URL + "";
    public static ATTACHMENT_URL: string = Config.API.BASE_URL + "";
    public static MESSAGE_URL: string = Config.API.BASE_URL + "";
    public static get SENDMAIL_URL(): string {
        return Config.API.BASE_URL + "/sendMail";
    }
    public static getExtenstion(fileName: string): string {
        return fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);
    };
}
