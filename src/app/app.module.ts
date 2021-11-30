import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MainComponent} from "./components/main/main.component";
import {RouterModule, Routes} from "@angular/router";
import {OwnerItemComponent} from './components/owner-item/owner-item.component';
import {OwnerFormComponent} from './components/owner-form/owner-form.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientInMemoryWebApiModule} from "angular-in-memory-web-api";
import {InMemOwnersService} from "./sevices/in-mem-owners-service";
import {HttpClientModule} from "@angular/common/http";
import {environment} from "../environments/environment";

const routes: Routes = [
    {path: '', component: MainComponent}
]

@NgModule({
    declarations: [
        AppComponent,
        MainComponent,
        OwnerItemComponent,
        OwnerFormComponent,
    ],
    imports: [
        NgbModule,
        BrowserModule,
        RouterModule,
        RouterModule.forRoot(routes),
        ReactiveFormsModule,
        environment.production ?
            [] : HttpClientInMemoryWebApiModule.forRoot(InMemOwnersService, {delay: 0}),
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
