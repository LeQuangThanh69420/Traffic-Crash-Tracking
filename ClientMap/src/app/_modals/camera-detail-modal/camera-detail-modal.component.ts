import { Component, OnDestroy, OnInit } from '@angular/core';
import { PresenceService } from 'src/app/_services/presence.service';
import { CameraDetailModalService } from '../camera-detail-modal.service';
import { StationControllerService } from 'src/app/_services/station-controller.service';

@Component({
  selector: 'app-camera-detail-modal',
  templateUrl: './camera-detail-modal.component.html',
  styleUrls: ['./camera-detail-modal.component.css']
})
export class CameraDetailModalComponent implements OnInit, OnDestroy{

  constructor(
    public stationController: StationControllerService,
    public cameraDetail: CameraDetailModalService,
    public presence: PresenceService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  ChangeStatus() {
    this.presence.ChangeStatus("Camera", this.cameraDetail.input.cameraName);
    this.cameraDetail.Close();
  }
}
