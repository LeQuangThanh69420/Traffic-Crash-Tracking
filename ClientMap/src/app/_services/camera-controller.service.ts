import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CameraGetCamerasOutputDTO } from '../_DTOs/CameraGetCamerasOutputDTO';

@Injectable({
  providedIn: 'root'
})
export class CameraControllerService {
  baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient) { }

  GetCameras() {
    return this.http.get<CameraGetCamerasOutputDTO[]>(this.baseUrl + "Camera/GetCameras");
  }

  AddOrEdit(input: any) {
    return this.http.post<any>(this.baseUrl + "Camera/AddOrEdit", input)
  }
}
