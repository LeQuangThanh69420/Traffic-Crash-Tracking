import { Component, OnDestroy, OnInit } from '@angular/core';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-camera-detail-modal',
  templateUrl: './camera-detail-modal.component.html',
  styleUrls: ['./camera-detail-modal.component.css']
})
export class CameraDetailModalComponent implements OnInit, OnDestroy{

  constructor(
    public presence: PresenceService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
