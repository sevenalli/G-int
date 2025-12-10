import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { MqttModule, IMqttServiceOptions } from 'ngx-mqtt';

import { routes } from './app.routes';

const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {
  hostname: '192.168.100.32',
  port: 9001,
  path: '/mqtt'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(MqttModule.forRoot(MQTT_SERVICE_OPTIONS))
  ]
};