import { HotTopicService, AuthGuard, ClientDbService, FileService, SyncService, LoginService, GetToken, LoadingService } from './services/index';
import { Store, EventHandler } from './utils/index';
import { CookieService } from 'ngx-cookie-service';

export * from './utils/index';
export * from './services/index';
export * from './pipes/index';
export * from './interfaces/index';
export * from './shared.module';

export const SERVICE_PROVIDERS: any[] = [
    HotTopicService,
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