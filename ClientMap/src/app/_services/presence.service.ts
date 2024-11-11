import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { StationControllerService } from './station-controller.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;

  onlineStations: string[];
  onlineCameras: Map<string, string> = new Map();
  stationMarkerUpdated = new Subject<void>();
  cameraMarkerUpdated = new Subject<void>();

  constructor(
    private stationController: StationControllerService, 
    private toastr: ToastrService) { }

  createHubConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + "presence", {
        accessTokenFactory: () => this.stationController.currentUser.token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .catch(error => console.log(error));

    this.hubConnection.onclose(() => {
      this.stationController.Logout();
    });

    this.hubConnection.on("StationConnected", (stationName: string) => {
      this.onlineStations.push(stationName);
      this.stationMarkerUpdated.next();
    });
    
    this.hubConnection.on("StationDisconnected", (stationName: string) => {
      this.onlineStations = this.onlineStations.filter(item => item !== stationName);
      this.stationMarkerUpdated.next();
    });

    this.hubConnection.on("GetOnlineStations", (stations: string[]) => {
      this.onlineStations = stations;
    });

    this.hubConnection.on("CamerasConnected", (cameraName: string) => {
      this.onlineCameras.set(cameraName, "");
      this.cameraMarkerUpdated.next();
    });

    this.hubConnection.on("CamerasDisconnected", (cameraName: string) => {
      this.onlineCameras.delete(cameraName);
      this.cameraMarkerUpdated.next();
    });

    this.hubConnection.on("GetOnlineCameras", (cameras: string[]) => {
      cameras.forEach(camera => {
        this.onlineCameras.set(camera, "");
      });
    });

    this.hubConnection.on("ReceiveFrameBase64", (camera: any) => {
      this.onlineCameras.set(camera.cameraName, camera.frameBase64);
    });
  }

  stopHubConnection() {
    this.hubConnection
      .stop()
      .catch(error => console.log(error));
  }
}
