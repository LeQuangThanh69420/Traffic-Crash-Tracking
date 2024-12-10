import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Map as LeafletMap } from 'leaflet';
import { ToastrService } from 'ngx-toastr';
import { markers } from 'src/environments/marker';
import { PresenceService } from '../_services/presence.service';
import { Subscription } from 'rxjs';
import { CameraGetCamerasOutputDTO } from '../_DTOs/CameraGetCamerasOutputDTO';
import { StationGetStationsOutputDTO } from '../_DTOs/StationGetStationsOutputDTO';
import { CameraControllerService } from '../_services/camera-controller.service';
import { StationControllerService } from '../_services/station-controller.service';
import { CameraAddOrEditModalService } from '../_modals/camera-add-or-edit-modal.service';
import { CameraDetailModalService } from '../_modals/camera-detail-modal.service';
import { StationAddOrEditModalService } from '../_modals/station-add-or-edit-modal.service';
import { StationDetailModalService } from '../_modals/station-detail-modal.service';
import { RequestControllerService } from '../_services/request-controller.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  map: LeafletMap = null!;
  markers = markers;
  stationUpdated: Subscription;
  cameraUpdated: Subscription;
  stationMarkerUpdated: Subscription;
  cameraMarkerUpdated: Subscription;
  statusMarkerUpdated: Subscription;
  waringCircleUpdated: Subscription;

  stationMarkers: Map<string, L.Marker<any>> = new Map();
  cameraMarkers: Map<string, L.Marker<any>> = new Map();

  stations: StationGetStationsOutputDTO[] = [];
  cameras: CameraGetCamerasOutputDTO[] = [];

  waringCircle: L.Circle<any>[] = [];
  warings: any[] = [];

  constructor(
    public stationController: StationControllerService,
    private cameraController: CameraControllerService,
    private requestController: RequestControllerService,
    private toastr: ToastrService,
    public presence: PresenceService,
    public cameraAddOrEdit: CameraAddOrEditModalService, 
    private cameraDetail: CameraDetailModalService,
    public stationAddOrEdit: StationAddOrEditModalService,
    private stationDetail: StationDetailModalService,) { }

  LoadMap() {
    this.map = L.map('map', { attributionControl: false })
      .setView([this.stationController.currentUser.latitude, this.stationController.currentUser.longitude], 14)
      .on("click", (e) => {
        if (this.isAdding == true) {
          if (this.tab == "Camera") {
            this.cameraAddOrEdit.Open({longitude: e.latlng.lng, latitude: e.latlng.lat});
          }
          if (this.tab == "Station") {
            this.stationAddOrEdit.Open({longitude: e.latlng.lng, latitude: e.latlng.lat});
          }
        }
      })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }

  LoadStationMarker() {
    this.stationMarkers.forEach((v, k) => {
      this.map.removeLayer(v);
    });
    this.stations.forEach(station => {
      var icon = this.GetStationMarker(station);
      this.stationMarkers.set(station.stationName, 
        L.marker([station.latitude, station.longitude], { icon: icon })
        .on('click', (e) => {
          this.stationDetail.Open(station);
        }));
    });
    this.stationMarkers.forEach((v, k) => {
      this.map.addLayer(v);
    });
  }

  GetStationMarker(station: any) {
    if (station.stationName == this.stationController.currentUser.stationName) {
      return markers.StationCurrent;
    }
    else {
      if (this.presence.onlineStations.includes(station.stationName)) {
        return markers.StationOnline;
      }
      else {
        if (station.isActive === false) {
          return markers.StationUnActive;
        }
        else {
          return markers.StationOffline;
        }
      }
    }
  }

  LoadCameraMarker() {
    this.cameraMarkers.forEach((v, k) => {
      this.map.removeLayer(v);
    });
    this.cameras.forEach(camera => {
      var icon = this.GetCameraMarker(camera);
      this.cameraMarkers.set(camera.cameraName, 
        L.marker([camera.latitude, camera.longitude], { icon: icon })
        .on("click", (e) => {
          this.cameraDetail.Open(camera);
        }));
    });
    this.cameraMarkers.forEach((v, k) => {
      this.map.addLayer(v);
    });
  }

  GetCameraMarker(camera: any) {
    if (this.presence.onlineCameras.has(camera.cameraName)) {
      return markers.CameraOnline;
    }
    else {
      if (camera.isActive === false) {
        return markers.CameraUnActive;
      }
      else {
        return markers.CameraOffline;
      }
    }
  }

  LoadWaringsCirle() {
    this.waringCircle.forEach((e) => {
      this.map.removeLayer(e);
    });
    this.waringCircle = [];
    this.warings.forEach((e) => {
      this.waringCircle.push(
        L.circle([e.y1, e.x1], {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: this.map.distance([e.y1, e.x1], [e.y2, e.x2])
        })
      );
    });
    this.waringCircle.forEach((e) => {
      this.map.addLayer(e);
    });
  }

  MarkerUpdate() {
    this.stationUpdated = this.stationAddOrEdit.stationUpdated.subscribe(() => {
      this.GetStations();
    });
    this.cameraUpdated = this.cameraAddOrEdit.cameraUpdated.subscribe(() => {
      this.GetCameras();
    });
    this.stationMarkerUpdated = this.presence.stationMarkerUpdated.subscribe(() => {
      this.LoadStationMarker();
    });
    this.cameraMarkerUpdated = this.presence.cameraMarkerUpdated.subscribe(() => {
      this.LoadCameraMarker();
    });
    this.statusMarkerUpdated = this.presence.statusMarkerUpdated.subscribe((output: any) => {
      if (output.obj == "Station") {
        var station = this.stations.find(s => s.stationName === output.name);
        if (station) {
          station.isActive = !station.isActive;
        }
        this.LoadStationMarker();
        return;
      }
      if (output.obj == "Camera") {
        var camera = this.cameras.find(s => s.cameraName === output.name);
        if (camera) {
          camera.isActive = !camera.isActive;
        }
        this.LoadCameraMarker();
        return;
      }
    });
    this.waringCircleUpdated = this.presence.waringCircleUpdated.subscribe((result) => {
      var item = this.warings.find(w => w.x1 === result.x1 && w.y1 === result.y1 && w.x2 === result.x2 && w.y2 === result.y2)
      if (item) {
        item.count += 1;
      }
      else {
        this.warings.push({ count: 1, x1: result.x1, y1: result.y1, x2: result.x2, y2: result.y2});
      }
      this.LoadWaringsCirle();
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

  GetWarings() {
    this.requestController.GetRequestsLocation().subscribe(response => {
      this.warings = response;
      this.LoadWaringsCirle();
    }, error => {
      this.toastr.error(error.error.message);
    });
  }

  ngOnInit() {
    this.LoadMap();
    this.MarkerUpdate();
    this.presence.createHubConnection();
    setTimeout(() => {
      this.GetStations();
      this.GetCameras();
      this.GetWarings();
    }, 0)

  }

  isAdding: boolean = false;
  addTog() {
    this.isAdding = !this.isAdding;
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
