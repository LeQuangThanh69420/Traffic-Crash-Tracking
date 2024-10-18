import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StationGetStationsOutputDTO } from '../_DTOs/StationGetStationsOutputDTO';
import { StationLoginInputDTO } from '../_DTOs/StationLoginInputDTO';
import { StationLoginOutputDTO } from '../_DTOs/StationLoginOutputDTO';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class StationControllerService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) { }

  Login(input: StationLoginInputDTO) {
    return this.http.post<StationLoginOutputDTO>(this.baseUrl + "Station/Login", input);
  }

  Logout() {
    window.localStorage.removeItem("user");
    this.router.navigate(['/login']);
    //stopHubConnection();
  }

  GetStations() {
    return this.http.get<StationGetStationsOutputDTO[]>(this.baseUrl + "Station/GetStations");
  }
}
