import { Component, OnInit } from '@angular/core';
import { StationLoginInputDTO } from '../_DTOs/StationLoginInputDTO';
import { StationControllerService } from '../_services/station-controller.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  currentStation: StationLoginInputDTO = { username: "", password: ""};

  constructor(private stationController: StationControllerService, private router: Router) { }

  ngOnInit() {
  }

  Login() {
    this.stationController.Login(this.currentStation).subscribe(response => {
        window.localStorage.setItem("currentStation", JSON.stringify(response));
        this.router.navigate(['/main']);
      }, error => {
        console.log(error);
      }
    );
  }

}
