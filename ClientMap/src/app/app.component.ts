import { Component, OnInit } from '@angular/core';
import { StationControllerService } from './_services/station-controller.service';
import { LoadingService } from './_services/loading.service';
import { CameraAddOrEditModalService } from './_modals/camera-add-or-edit-modal.service';
import { CameraDetailModalService } from './_modals/camera-detail-modal.service';
import { StationAddOrEditModalService } from './_modals/station-add-or-edit-modal.service';
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
    public cameraAddOrEdit: CameraAddOrEditModalService, 
    public cameraDetail: CameraDetailModalService,
    public stationAddOrEdit: StationAddOrEditModalService,
    public stationDetail: StationDetailModalService,) { }

  ngOnInit(): void {
    this.stationController.GetCurrentUser();
  }

  title = 'ClientMap';
}
