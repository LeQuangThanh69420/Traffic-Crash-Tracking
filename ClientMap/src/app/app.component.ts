import { Component, OnInit } from '@angular/core';
import { StationControllerService } from './_services/station-controller.service';
import { LoadingService } from './_services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private stationController: StationControllerService, 
    public loading: LoadingService) { }

  ngOnInit(): void {
    this.stationController.GetCurrentUser();
  }

  title = 'ClientMap';
}
