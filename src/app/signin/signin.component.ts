import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { ToolService } from '../services/tool.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss',
    '../../vendor/styles/pages/authentication.scss']
})
export class SigninComponent implements OnInit {


  constructor(
    public toolService: ToolService,
    private router: Router,
    private dataService: DataService,
  ) { }

  ngOnInit() {
  }


  adminData = {
    email: null,
    password: null,
  }

  onSignIn() {
    this.toolService.btnLoading = true;
    if (this.adminData.email && this.adminData.password) {
      this.dataService.loginAdmin(this.adminData).subscribe((resp: any) => {
        localStorage.setItem('ticketsAdmin', JSON.stringify(resp.admin));
        this.toolService.setAdminData();
        this.router.navigate(['/users']);
        this.toolService.btnLoading = false;
      }, err => {
        this.toolService.showMyAlert("danger", err.error.message);
        this.toolService.btnLoading = false;
      })
    } else {
      this.toolService.btnLoading = false;
      this.toolService.showMyAlert("warning", "Please fill all the details!");
    }
  }



}
