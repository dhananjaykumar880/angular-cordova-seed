import { Routes } from '@angular/router';
// app
import { LoginComponent } from './components/login/login.component';
import { GetToken } from '../common';

export const LoginRoutes: Routes = [
    {
        path: '',
        component: LoginComponent,
        canActivate: [GetToken],
        runGuardsAndResolvers: 'paramsOrQueryParamsChange'
    },
    {
        path: ':error',
        component: LoginComponent
    }
];
