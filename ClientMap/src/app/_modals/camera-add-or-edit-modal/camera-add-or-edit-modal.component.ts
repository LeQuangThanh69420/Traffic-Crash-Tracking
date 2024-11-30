import { Component } from '@angular/core';
import { CameraAddOrEditModalService } from '../camera-add-or-edit-modal.service';
import { CameraControllerService } from 'src/app/_services/camera-controller.service';

@Component({
  selector: 'app-camera-add-or-edit-modal',
  templateUrl: './camera-add-or-edit-modal.component.html',
  styleUrls: ['./camera-add-or-edit-modal.component.css']
})
export class CameraAddOrEditModalComponent {

  constructor(
    public cameraController: CameraControllerService,
    public cameraAddOrEdit: CameraAddOrEditModalService) { }
  
}
