import { Component } from '@angular/core';
import { StationAddOrEditModalService } from '../station-add-or-edit-modal.service';
import { StationControllerService } from 'src/app/_services/station-controller.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-station-add-or-edit-modal',
  templateUrl: './station-add-or-edit-modal.component.html',
  styleUrls: ['./station-add-or-edit-modal.component.css']
})
export class StationAddOrEditModalComponent {

  constructor(
    private toastr: ToastrService,
    public stationController: StationControllerService,
    public stationAddOrEdit: StationAddOrEditModalService) { }

  visible: boolean = false;
  showPassword() {
    this.visible = !this.visible;
  }

  AddOrEdit() {
    this.stationController.AddOrEdit(this.stationAddOrEdit.input).subscribe(response => {
      if (response.success) {
        this.toastr.success("Success")
        this.stationAddOrEdit.stationUpdated.next()
        this.stationAddOrEdit.Close()
      }
    }, error => {
      if(error.error.message) {
        this.toastr.error(error.error.message)
      }
    });
  }
}
