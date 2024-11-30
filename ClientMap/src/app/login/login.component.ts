import { Component, OnInit } from '@angular/core';
import { StationLoginInputDTO } from '../_DTOs/StationLoginInputDTO';
import { StationControllerService } from '../_services/station-controller.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CameraAddOrEditModalService } from '../_modals/camera-add-or-edit-modal.service';
import { CameraDetailModalService } from '../_modals/camera-detail-modal.service';
import { StationAddOrEditModalService } from '../_modals/station-add-or-edit-modal.service';
import { StationDetailModalService } from '../_modals/station-detail-modal.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  visible: boolean = false;
  currentUser: StationLoginInputDTO = { username: "", password: ""};

  constructor(
    private stationController: StationControllerService, 
    private router: Router, 
    private toastr: ToastrService,
    public cameraAddOrEdit: CameraAddOrEditModalService, 
    public cameraDetail: CameraDetailModalService,
    public stationAddOrEdit: StationAddOrEditModalService,
    public stationDetail: StationDetailModalService,) { }

  ngOnInit() {
    if(this.stationController.currentUser) {
      this.router.navigate(['/main']);
    }
    this.cameraAddOrEdit.Close();
    this.cameraDetail.Close();
    this.stationAddOrEdit.Close();
    this.stationDetail.Close();
  }

  showPassword() {
    this.visible = !this.visible;
  }

  Login() {
    this.stationController.Login(this.currentUser).subscribe(response => {
        this.stationController.SetCurrentUser(response);
        this.router.navigate(['/main']);
      }, error => {
        this.toastr.error(error.error.message);
      }
    );
  }

}
