import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentStation = JSON.parse(window.localStorage.getItem("currentStation")!);
    if(currentStation) {
      request = request.clone({
        setHeaders: {
          Authorization: `${currentStation.token}`
        }
      })
    }

    return next.handle(request);
  }
}
