import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  constructor(
    private title: Title,
    private router: Router,
  ) {
  }


  // Set page title
  set pageTitle(value: string) {
    this.title.setTitle(`${value} - Bomb Ticket`);
  }


  myAlertClass = true;
  myAlertShow = false;
  myAlertType: any;
  myAlertMessage: any;

  showLoading = true;
  btnLoading = false;

  showMyAlert(type, message) {
    this.myAlertType = 'dark-' + type;
    this.myAlertMessage = message;
    this.myAlertShow = true;
    setTimeout(() => {
      this.myAlertClass = false;
    }, 2500);
    setTimeout(() => {
      this.myAlertShow = false;
    }, 3000);
    setTimeout(() => {
      this.myAlertClass = true;
    }, 3500);
  }

  adminCredentials = {
    email: 'admin@bombticket.com',
    password: 'admin1234',
  }


  setAdminData() {
    var randText = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 15; i++) {
      randText += characters.charAt(Math.floor(Math.random() * characters.length));
      if (i == 14) {
        let encrypt = CryptoJS.AES.encrypt('ticketsAdmin@NLS'.trim(), randText.trim()).toString();
        let data = {
          text_1: encrypt,
          text_2: randText,
        }
        localStorage.setItem('ticketsText', JSON.stringify(data));
      }
    }
  }

  checkAdminData() {
    let ticketsText = localStorage.getItem('ticketsText');
    if (ticketsText) {
      let text_1 = JSON.parse(ticketsText).text_1;
      let text_2 = JSON.parse(ticketsText).text_2;
      let decrypt = CryptoJS.AES.decrypt(text_1.trim(), text_2.trim()).toString(CryptoJS.enc.Utf8);
      if (decrypt != 'ticketsAdmin@NLS') {
        localStorage.clear();
      }
    } else {
      localStorage.clear();
    }
  }

}
