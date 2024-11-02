import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StationControllerService } from '../_services/station-controller.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private stationController: StationControllerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let currentUser = this.stationController.currentUser;
    if(currentUser) {
      request = request.clone({
        setHeaders: {
          Authorization: `${currentUser.token}`
        }
      })
    }

    return next.handle(request);
  }
}
