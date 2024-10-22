import { Component, OnInit } from '@angular/core';
import { StationControllerService } from './_services/station-controller.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private stationController: StationControllerService) { }

  ngOnInit(): void {
    this.stationController.GetCurrentUser();
  }

  title = 'ClientMap';
}
