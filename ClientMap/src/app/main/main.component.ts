import { Component, OnInit } from '@angular/core';
import { StationControllerService } from '../_services/station-controller.service';
import { CameraControllerService } from '../_services/camera-controller.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(private stationController: StationControllerService, private cameraController: CameraControllerService) { }

  ngOnInit() {
  }

}
