import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CameraDetailModalService {

  public isOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  Open() {
    this.isOpen.next(true);
  }

  Close() {
    this.isOpen.next(false);
  }

  constructor() { }
}
