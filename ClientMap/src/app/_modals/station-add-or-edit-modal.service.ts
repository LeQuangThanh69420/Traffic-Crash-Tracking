import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StationAddOrEditModalService {
  stationUpdated = new Subject<void>();

  public isOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  input: any = { stationId: 0, stationName: '', username: '', password: '', address: '', longitude: 0, latitude: 0 };

  Open(input: any) {
    if (!input.stationId) {
      this.input = { ...this.input, longitude: input.longitude, latitude: input.latitude };
    }
    this.input = structuredClone(input);
    this.isOpen.next(true);
  }

  Close() {
    this.input = { stationId: 0, stationName: '', username: '', password: '', address: '', longitude: 0, latitude: 0 };
    this.isOpen.next(false);
  }

  constructor() { }
}
