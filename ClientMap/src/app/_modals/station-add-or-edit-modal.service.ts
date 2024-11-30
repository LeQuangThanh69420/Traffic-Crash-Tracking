import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StationAddOrEditModalService {

  public isOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  input: any;

  Open(input?: any): void {
    if (input !== undefined) {
      this.input = input;
    }
    this.isOpen.next(true);
  }

  Close() {
    this.input = null;
    this.isOpen.next(false);
  }

  constructor() { }
}
