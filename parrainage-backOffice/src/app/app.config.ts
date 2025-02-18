import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding   } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';




export const appConfig: ApplicationConfig = {
  providers:
  [provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes,  withComponentInputBinding()),
     provideHttpClient(withFetch()),
     provideClientHydration(withEventReplay()),
     provideAnimationsAsync()]

};
