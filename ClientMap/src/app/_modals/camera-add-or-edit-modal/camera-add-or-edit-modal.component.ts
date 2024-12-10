import { Component } from '@angular/core';
import { CameraAddOrEditModalService } from '../camera-add-or-edit-modal.service';
import { CameraControllerService } from 'src/app/_services/camera-controller.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-camera-add-or-edit-modal',
  templateUrl: './camera-add-or-edit-modal.component.html',
  styleUrls: ['./camera-add-or-edit-modal.component.css']
})
export class CameraAddOrEditModalComponent {

  constructor(
    private toastr: ToastrService,
    public cameraController: CameraControllerService,
    public cameraAddOrEdit: CameraAddOrEditModalService) { }
  
  AddOrEdit() {
    this.cameraController.AddOrEdit(this.cameraAddOrEdit.input).subscribe(response => {
      if (response.success) {
        this.toastr.success("Success")
        this.cameraAddOrEdit.cameraUpdated.next()
        this.cameraAddOrEdit.Close()
      }
    }, error => {
      if(error.error.message) {
        this.toastr.error(error.error.message)
      }
    });
  }
}
