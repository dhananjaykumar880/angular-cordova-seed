import { AuthGuard, ClientDbService, FileService, SyncService, LoginService, GetToken, LoadingService, HttpDataService, PopEventService } from './services';
import { Store, EventHandler } from './utils';
import { CookieService } from 'ngx-cookie-service';

export * from './utils';
export * from './services';
export * from './pipes';
export * from './interfaces';
export * from './shared.module';

/**
 * export all services to inject in app module
 */
export const SERVICE_PROVIDERS: any[] = [
    HttpDataService,
    AuthGuard,
    GetToken,
    ClientDbService,
    Store,
    EventHandler,
    CookieService,
    FileService,
    SyncService,
    LoginService,
    LoadingService,
    PopEventService
];
