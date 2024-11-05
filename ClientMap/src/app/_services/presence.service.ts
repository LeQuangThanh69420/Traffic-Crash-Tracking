import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';
import { StationControllerService } from './station-controller.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {

  hubUrl = environment.hubUrl;
  private hubConnection: HubConnection;

  onlineStations: string[];

  constructor(
    private stationController: StationControllerService, 
    private toastr: ToastrService) { }

  createHubConnection() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + "presence", {
        accessTokenFactory: () => this.stationController.currentUser.token.replace("Bearer ", "")
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .catch(error => console.log(error));

    this.hubConnection.onclose(() => {
      this.stationController.Logout();
      this.toastr.error("Your account's logged in on another device");
    });

    this.hubConnection.on("StationConnected", (stationName: string) => {
      this.onlineStations.push(stationName);
    });
    
    this.hubConnection.on("StationDisconnected", (stationName: string) => {
      this.onlineStations = this.onlineStations.filter(item => item !== stationName);
    });

    this.hubConnection.on("GetOnlineStations", (stations: string[]) => {
      this.onlineStations = stations;
    });
  }

  stopHubConnection() {
    this.hubConnection
      .stop()
      .catch(error => console.log(error));
  }
}
