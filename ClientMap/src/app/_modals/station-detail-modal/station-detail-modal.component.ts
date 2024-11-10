import { Component, OnDestroy, OnInit } from '@angular/core';
import { PresenceService } from 'src/app/_services/presence.service';

@Component({
  selector: 'app-station-detail-modal',
  templateUrl: './station-detail-modal.component.html',
  styleUrls: ['./station-detail-modal.component.css']
})
export class StationDetailModalComponent implements OnInit, OnDestroy{

  constructor(
    public presence: PresenceService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }
}
