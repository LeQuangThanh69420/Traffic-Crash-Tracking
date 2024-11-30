import { Component } from '@angular/core';
import { StationAddOrEditModalService } from '../station-add-or-edit-modal.service';
import { StationControllerService } from 'src/app/_services/station-controller.service';

@Component({
  selector: 'app-station-add-or-edit-modal',
  templateUrl: './station-add-or-edit-modal.component.html',
  styleUrls: ['./station-add-or-edit-modal.component.css']
})
export class StationAddOrEditModalComponent {

  constructor(
    public stationController: StationControllerService,
    public stationAddOrEdit: StationAddOrEditModalService) { }

}
