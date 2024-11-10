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
    public presence: PresenceService) { }

  LoadMap() {
    this.map = L.map('map', { attributionControl: false })
      .setView([this.stationController.currentUser.latitude, this.stationController.currentUser.longitude], 14)
      .on("click", (e) => {
      })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  LoadStationMarker() {
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
      this.stationMarkers.set(station.stationName, 
        L.marker([station.latitude, station.longitude], { icon: icon })
        .on('click', (e) => {
        }));
    });
    this.stationMarkers.forEach((v, k) => {
      this.map.addLayer(v);
    });
  }

  LoadCameraMarker() {
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
      this.cameraMarkers.set(camera.cameraName, 
        L.marker([camera.latitude, camera.longitude], { icon: icon })
        .on("click", (e) => {
        }));
    });
    this.cameraMarkers.forEach((v, k) => {
      this.map.addLayer(v);
    });
  }

  MarkerUpdate() {
    this.markerUpdate = this.presence.markerUpdated.subscribe(() => {
      this.stationMarkers.forEach((v, k) => {
        this.map.removeLayer(v);
      });
      this.cameraMarkers.forEach((v, k) => {
        this.map.removeLayer(v);
      });
      this.LoadStationMarker();
      this.LoadCameraMarker();
    });
  }

  GetStations() {
    this.stationController.GetStations().subscribe(response => {
      this.stations = response;
      this.LoadStationMarker();
    }, error => {
      this.toastr.error(error.error.message);
    });
  }

  GetCameras() {
    this.cameraController.GetCameras().subscribe(response => {
      this.cameras = response;
      this.LoadCameraMarker();
    }, error => {
      this.toastr.error(error.error.message);
    });
  }

  ngOnInit() {
    this.presence.createHubConnection();
    this.LoadMap();

    this.MarkerUpdate();

    setTimeout(() => {
      this.GetStations();
      this.GetCameras();
    }, 0)

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
