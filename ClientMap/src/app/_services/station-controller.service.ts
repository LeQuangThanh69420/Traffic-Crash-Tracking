import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StationGetStationsOutputDTO } from '../_DTOs/StationGetStationsOutputDTO';
import { StationLoginInputDTO } from '../_DTOs/StationLoginInputDTO';
import { StationLoginOutputDTO } from '../_DTOs/StationLoginOutputDTO';

@Injectable({
  providedIn: 'root'
})
export class StationControllerService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  Login(input: StationLoginInputDTO) {
    return this.http.post<StationLoginOutputDTO>(this.baseUrl + "Station/Login", input);
  }

  setCurrentUser() {}
  logout() {}

  GetStations() {
    return this.http.get<StationGetStationsOutputDTO[]>(this.baseUrl + "Station/GetStations");
  }
}
