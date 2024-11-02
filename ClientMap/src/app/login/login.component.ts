import { Component, OnInit } from '@angular/core';
import { StationLoginInputDTO } from '../_DTOs/StationLoginInputDTO';
import { StationControllerService } from '../_services/station-controller.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  currentUser: StationLoginInputDTO = { username: "", password: ""};

  constructor(
    private stationController: StationControllerService, 
    private router: Router, 
    private toastr: ToastrService) { }

  ngOnInit() {
    if(this.stationController.currentUser) {
      this.router.navigate(['/main']);
    }
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
