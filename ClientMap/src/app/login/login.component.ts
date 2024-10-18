import { Component, OnInit } from '@angular/core';
import { StationLoginInputDTO } from '../_DTOs/StationLoginInputDTO';
import { StationControllerService } from '../_services/station-controller.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user: StationLoginInputDTO = { username: "", password: ""};

  constructor(private stationController: StationControllerService) { }

  ngOnInit() {
  }

  Login() {
    this.stationController.Login(this.user).subscribe(response => {
        console.log(response);
      }, error => {
        console.log(error);
      }
    );
  }

}
