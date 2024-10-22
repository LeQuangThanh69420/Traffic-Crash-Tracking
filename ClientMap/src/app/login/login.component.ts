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
  currentUser: StationLoginInputDTO = { username: "", password: ""};

  constructor(private stationController: StationControllerService, private router: Router) { }

  ngOnInit() {
  }

  Login() {
    this.stationController.Login(this.currentUser).subscribe(response => {
        this.stationController.SetCurrentUser(response);
        this.router.navigate(['/main']);
      }, error => {
        console.log(error);
      }
    );
  }

}
