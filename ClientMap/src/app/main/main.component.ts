import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StationControllerService } from '../_services/station-controller.service';
import { CameraControllerService } from '../_services/camera-controller.service';
import * as L from 'leaflet';
import { Map as LeafletMap } from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { markers } from 'src/environments/marker';
import { CameraGetCamerasOutputDTO } from '../_DTOs/CameraGetCamerasOutputDTO';
import { StationGetStationsOutputDTO } from '../_DTOs/StationGetStationsOutputDTO';
import { PresenceService } from '../_services/presence.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  map: LeafletMap = null!;
  markers = markers;

  stationMarkers: Map<string, L.Marker<any>> = new Map();
  cameraMarkers: Map<string, L.Marker<any>> = new Map();
  markerUpdate: Subscription;

  stations: StationGetStationsOutputDTO[] = [];
  cameras: CameraGetCamerasOutputDTO[] = [];

  constructor(
    public stationController: StationControllerService,
    private cameraController: CameraControllerService,
    private toastr: ToastrService,
    public presence: PresenceService,) { }

  GetStations() {
    this.stationController.GetStations().subscribe(response => {
      this.stations = response;
      this.loadStationMarker();
    }, error => {
      this.toastr.error(error.error.message);
    });
  }

  GetCameras() {
    this.cameraController.GetCameras().subscribe(response => {
      this.cameras = response;
      this.loadCameraMarker();
    }, error => {
      this.toastr.error(error.error.message);
    });
  }

  ngOnInit() {
    this.presence.createHubConnection();
    this.loadMap();

    setTimeout(() => {
      this.GetStations();
      this.GetCameras();
    }, 0)

    this.markerUpdate = this.presence.markerUpdated.subscribe(() => {
      this.stationMarkers.forEach((v, k) => {
        this.map.removeLayer(v);
      });
      this.cameraMarkers.forEach((v, k) => {
        this.map.removeLayer(v);
      });
      this.loadStationMarker();
      this.loadCameraMarker();
    });
  }

  loadMap() {
    this.map = L.map('map', { attributionControl: false })
      .setView([this.stationController.currentUser.latitude, this.stationController.currentUser.longitude], 14)
      .on("click", (e) => {
      })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  loadStationMarker() {
    this.stations.forEach(station => {
      var icon;
      if (station.stationName == this.stationController.currentUser.stationName) {
        icon = markers.StationCurrent;
      }
      else {
        if (this.presence.onlineStations.includes(station.stationName)) {
          icon = markers.StationOnline;
        }
        else {
          if (station.isActive === false) {
            icon = markers.StationUnActive;
          }
          else {
            icon = markers.StationOffline;
          }
        }
      }
      this.stationMarkers.set(station.stationName, L.marker([station.latitude, station.longitude], { icon: icon }));
    });
    this.stationMarkers.forEach((v, k) => {
      this.map.addLayer(v);
    });
  }

  loadCameraMarker() {
    this.cameras.forEach(camera => {
      var icon;
      if (this.presence.onlineCameras.has(camera.cameraName)) {
        icon = markers.CameraOnline;
      }
      else {
        if (camera.isActive === false) {
          icon = markers.CameraUnActive;
        }
        else {
          icon = markers.CameraOffline;
        }
      }
      this.cameraMarkers.set(camera.cameraName, L.marker([camera.latitude, camera.longitude], { icon: icon }));
    });
    this.cameraMarkers.forEach((v, k) => {
      this.map.addLayer(v);
    });
  }

  addTog() {

  }

  Logout() {
    this.presence.stopHubConnection();
    this.stationController.Logout();
  }

  tab: string = "Camera";
  setTab(tab: string) {
    if (this.tab == tab || (tab != "Camera" && tab != "Station")) {
      return;
    }
    this.tab = tab;
  }

  toLocation(latitude: number, longitude: number) {
    this.map.setView([latitude, longitude], 14);
  }
}
