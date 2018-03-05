// angular
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { Routes } from "@angular/router";
import { AuthGuard } from "./common";

export const AppRoutes: Routes = [
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "login", loadChildren: "./login/login.module#LoginModule"},
    { path: "home", loadChildren: "./home/home.module#HomeModule", canActivate: [AuthGuard] },
];

@NgModule({
    imports: [
        RouterModule.forRoot(AppRoutes)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }