import { Component, OnInit } from '@angular/core';
import { StationControllerService } from './_services/station-controller.service';
import { LoadingService } from './_services/loading.service';
import { CameraDetailModalService } from './_modals/camera-detail-modal.service';
import { StationDetailModalService } from './_modals/station-detail-modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private stationController: StationControllerService, 
    public loading: LoadingService,
    public cameraDetail: CameraDetailModalService,
    public stationDetail: StationDetailModalService) { }

  ngOnInit(): void {
    this.stationController.GetCurrentUser();
  }

  title = 'ClientMap';
}
