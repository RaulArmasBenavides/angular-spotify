import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CookieService } from 'ngx-cookie-service';
import { InjectSessionInterceptor } from '@core/interceptors/inject-session.interceptor';

@NgModule({ declarations: [
        AppComponent,
    ],
    bootstrap: [AppComponent], imports: [//TODO: Solo se importan otros modules
        BrowserModule,
        AppRoutingModule], providers: [
        CookieService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: InjectSessionInterceptor,
            multi: true
        },
        provideHttpClient(withInterceptorsFromDi())
    ] })
export class AppModule { }
