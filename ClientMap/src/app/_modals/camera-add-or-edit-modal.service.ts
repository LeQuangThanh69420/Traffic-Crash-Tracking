import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CameraAddOrEditModalService {
  cameraUpdated = new Subject<void>();

  public isOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  input: any = { cameraId: 0, cameraName: '', longitude: 0, latitude: 0 };

  Open(input: any) {
    if (!input.cameraId) {
      this.input = { ...this.input, longitude: input.longitude, latitude: input.latitude };
    }
    this.input = structuredClone(input);
    this.isOpen.next(true);
  }

  Close() {
    this.input = { cameraId: 0, cameraName: '', longitude: 0, latitude: 0 };
    this.isOpen.next(false);
  }

  constructor() { }
}
