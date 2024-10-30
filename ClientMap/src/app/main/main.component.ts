import { AfterContentInit, AfterViewInit, Component, OnInit } from '@angular/core';
import { StationControllerService } from '../_services/station-controller.service';
import { CameraControllerService } from '../_services/camera-controller.service';
import * as L from 'leaflet';
import { Map } from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { markers } from 'src/environments/marker';
import { CameraGetCamerasOutputDTO } from '../_DTOs/CameraGetCamerasOutputDTO';
import { StationGetStationsOutputDTO } from '../_DTOs/StationGetStationsOutputDTO';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public stationController: StationControllerService, 
    private cameraController: CameraControllerService,
    private toastr: ToastrService) { 
    }

  map: Map = null!;
  markers = markers;

  stations: StationGetStationsOutputDTO[] = [];
  cameras: CameraGetCamerasOutputDTO[] = [];

  ngOnInit() {
    this.map = L.map('map', { attributionControl:false })
    .on("click", (e) => {

    })
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.toMyLocation();
    this.loadData();
  }

  loadData() {
    setTimeout(() => {
      this.GetStations();
      this.GetCameras();
    }, 0)
  }

  toMyLocation() {
    this.map.setView([this.stationController.currentUser.latitude, this.stationController.currentUser.longitude], 15)
  }

  toLocation(latitude: number, longitude: number) {
    this.map.setView([latitude, longitude], 15)
  }

  addTog() {
    
  }

  GetStations() {
    this.stationController.GetStations().subscribe(response => {
      this.stations = response;
    }, error => {
      this.toastr.error(error.error.message);
    });
  }

  GetCameras() {
    this.cameraController.GetCameras().subscribe(response => {
      this.cameras = response;
    }, error => {
      this.toastr.error(error.error.message);
    });
  }
}
