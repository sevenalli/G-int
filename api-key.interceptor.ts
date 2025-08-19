import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';

@Injectable()
export class ApiKeyInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Clone the request to add the new header.
    const apiKeyReq = req.clone({
      headers: req.headers.set(environment.apiKeyHeader, environment.apiKey)
    });

    // Pass the cloned request instead of the original request to the next handle.
    return next.handle(apiKeyReq);
  }
}