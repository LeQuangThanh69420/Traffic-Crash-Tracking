import { Component, OnInit } from '@angular/core';
import { StationControllerService } from '../_services/station-controller.service';
import { CameraControllerService } from '../_services/camera-controller.service';
import * as L from 'leaflet';
import { Map } from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { markers } from 'src/environments/marker';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  constructor(public stationController: StationControllerService, private cameraController: CameraControllerService) { }

  map: Map = null!;
  markers = markers;

  ngOnInit() {
    this.map = L.map('map', { attributionControl:false })
    .on("click", (e) => {
      
    })
    
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.toMyLocation();
  }

  toMyLocation() {
    this.map.setView([this.stationController.currentUser.latitude, this.stationController.currentUser.longitude], 15)
  }

  toLocation(latitude: number, longitude: number) {
    this.map.setView([latitude, longitude], 15)
  }

  addTog() {
    
  }

}
