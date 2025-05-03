import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { ApplicationConfig } from '@angular/core';         // core config type
import { provideRouter }        from '@angular/router';     // router provider

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
