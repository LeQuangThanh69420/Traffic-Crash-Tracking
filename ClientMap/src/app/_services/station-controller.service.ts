import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StationGetStationsOutputDTO } from '../_DTOs/StationGetStationsOutputDTO';
import { StationLoginInputDTO } from '../_DTOs/StationLoginInputDTO';
import { StationLoginOutputDTO } from '../_DTOs/StationLoginOutputDTO';
import { Router } from '@angular/router';
import { PresenceService } from './presence.service';

@Injectable({
  providedIn: 'root'
})
export class StationControllerService {
  baseUrl = environment.apiUrl;
  currentUser: StationLoginOutputDTO;;

  constructor(
    private http: HttpClient, 
    private router: Router) { }

  SetCurrentUser(user: StationLoginOutputDTO) {
    this.currentUser = user;
    window.localStorage.setItem("currentUser", JSON.stringify(user));
  }

  GetCurrentUser() {
    this.currentUser = JSON.parse(window.localStorage.getItem("currentUser")!);
  }

  Login(input: StationLoginInputDTO) {
    return this.http.post<StationLoginOutputDTO>(this.baseUrl + "Station/Login", input);
  }

  Logout() {
    this.currentUser = null!;
    window.localStorage.removeItem("currentUser");
    this.router.navigate(['/login']);
  }

  GetStations() {
    return this.http.get<StationGetStationsOutputDTO[]>(this.baseUrl + "Station/GetStations");
  }

  AddOrEdit(input: any) {
    return this.http.post<any>(this.baseUrl + "Station/AddOrEdit", input)
  }
}
