import { AuthGuard, ClientDbService, FileService, SyncService, LoginService, GetToken, LoadingService, HttpDataService } from './services/index';
import { Store, EventHandler } from './utils/index';
import { CookieService } from 'ngx-cookie-service';

export * from './utils/index';
export * from './services/index';
export * from './pipes/index';
export * from './interfaces/index';
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
    LoadingService
];
