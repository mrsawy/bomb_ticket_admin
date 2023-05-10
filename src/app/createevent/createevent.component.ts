import { Component, OnInit, ViewChild } from '@angular/core';
// import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
// import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { DataService } from '../services/data.service';
import { ToolService } from '../services/tool.service';
import { DatePipe, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

// declare var google: any;
const dateNow = new Date();

@Component({
  selector: 'app-createevent',
  templateUrl: './createevent.component.html',
  styleUrls: ['./createevent.component.scss',
    '../../vendor/libs/ngb-datepicker/ngb-datepicker.scss',
    '../../vendor/libs/ngb-timepicker/ngb-timepicker.scss',
  ],
})
export class CreateeventComponent implements OnInit {

  constructor(
    private dataService: DataService,
    public toolService: ToolService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
  ) { }

  eventType = true;
  eventId: any;
  editEventData: any;

  ngOnInit() {
    this.checkEventType();
  }

  checkEventType() {
    let myEventId = this.activatedRoute.snapshot.params.eventId;
    if (myEventId) {
      this.eventId = myEventId;
      this.eventType = false;
      this.getEvent();
    } else {
      this.eventType = true;
      this.onClear();
      // this.getMyLocation();
      // this.setCurrentDT();
    }
  }

  getEvent() {
    this.dataService.getEvent(this.eventId).subscribe((resp: any) => {
      this.editEventData = resp;
      this.setEditEvent();
    })
  }

  setEditEvent() {
    this.eventData = {
      title: this.editEventData.title,
      subtitle: this.editEventData.subtitle,
      eventImg: this.editEventData.eventImg,
      locationImg: this.editEventData.locationImg,
      dateTime: this.editEventData.dateTime,
      termsAndCondition: this.editEventData.termsAndCondition,
      location: this.editEventData.location,
      // lat: JSON.parse(this.editEventData.lat),
      // lng: JSON.parse(this.editEventData.lng),
    }
    if (this.editEventData.dateTime) {
      let dateAndTime = new Date(this.editEventData.dateTime);
      this.myDate = {
        year: dateAndTime.getFullYear(),
        month: dateAndTime.getMonth() + 1,
        day: dateAndTime.getDate()
      };
      this.myTime = {
        hour: dateAndTime.getUTCHours(),
        minute: dateAndTime.getUTCMinutes(),
      }
    }
  }

  onGoBack() {
    this.location.back();
  }

  // setCurrentDT() {
  //   this.myDate = {
  //     year: dateNow.getFullYear(),
  //     month: dateNow.getMonth() + 1,
  //     day: dateNow.getDate()
  //   };
  //   this.myTime = {
  //     hour: dateNow.getHours(),
  //     minute: dateNow.getMinutes(),
  //   }
  // }

  myDate: NgbDateStruct = {
    year: dateNow.getFullYear(),
    month: dateNow.getMonth() + 1,
    day: dateNow.getDate()
  };
  myTime = {
    // hour: dateNow.getHours(),
    // minute: dateNow.getMinutes(),
    hour: 12,
    minute: 30,
  }

  eventData = {
    title: null,
    subtitle: null,
    eventImg: null,
    dateTime: null,
    termsAndCondition: null,
    locationImg: null,
    location: null,
    // lat: null,
    // lng: null,
  }

  eventFile: any;
  locationFile: any;

  processFile(event, type) {
    if (type == 'event') {
      if (event.target.files.length > 0) {
        this.eventFile = event.target.files[0];
      }
    } else if (type == 'location') {
      if (event.target.files.length > 0) {
        this.locationFile = event.target.files[0];
      }
    }
  }

  showValidation = false;

  inputReturner() {
    if (this.eventData.title &&
      this.eventData.subtitle &&
      this.eventData.termsAndCondition &&
      this.eventData.location
      // this.eventData.lat &&
      // this.eventData.lng
    ) {
      return true;
    } else {
      this.showValidation = true;
      return false;
    }
  }

  onCreateEvent() {
    if (this.inputReturner() && this.eventFile && this.locationFile) {
      this.toolService.btnLoading = true;
      let date = this.myDate;
      let time = this.myTime;
      this.eventData.dateTime = `${date.year}-${date.month}-${date.day} ${time.hour}:${time.minute}:00.000Z`;
      // this.eventData.dateTime = new Date(`${date.year}-${date.month}-${date.day} ${time.hour}:${time.minute}`);
      this.dataService.uploadFile(this.eventFile).subscribe((eventImg: any) => {
        this.eventData.eventImg = eventImg;
        this.dataService.uploadFile(this.locationFile).subscribe((locationImg: any) => {
          this.eventData.locationImg = locationImg;
          this.dataService.createEvent(this.eventData).subscribe((resp: any) => {
            this.toolService.showMyAlert('success', resp.message);
            this.toolService.btnLoading = false;
            this.onClear();
            this.location.back();
          }, err => {
            this.toolService.showMyAlert('danger', err.error.error);
            this.toolService.btnLoading = false;
          })
        })
      })
    } else {
      this.toolService.showMyAlert('warning', 'Please fill all the details!')
    }
  }


  onUpdateEvent() {
    if (this.inputReturner()) {
      this.toolService.btnLoading = true;
      let date = this.myDate;
      let time = this.myTime;
      this.eventData.dateTime = `${date.year}-${date.month}-${date.day} ${time.hour}:${time.minute}:00.000Z`;
      // this.eventData.dateTime = new Date(`${date.year}-${date.month}-${date.day} ${time.hour}:${time.minute}`);
      if (this.eventFile && this.locationFile) {
        this.dataService.uploadFile(this.eventFile).subscribe((eventImg: any) => {
          this.eventData.locationImg = eventImg;
          this.dataService.uploadFile(this.locationFile).subscribe((locationImg: any) => {
            this.eventData.locationImg = locationImg;
            this.sendEventData();
          })
        })
      } else if (this.eventFile && !this.locationFile) {
        this.dataService.uploadFile(this.eventFile).subscribe((eventImg: any) => {
          this.eventData.eventImg = eventImg;
          this.sendEventData();
        })
      } else if (!this.eventFile && this.locationFile) {
        this.dataService.uploadFile(this.locationFile).subscribe((locationImg: any) => {
          this.eventData.locationImg = locationImg;
          this.sendEventData();
        })
      } else {
        this.sendEventData();
      }
    } else {
      this.toolService.showMyAlert('warning', 'Please fill all the details!')
    }
  }

  sendEventData() {
    this.dataService.updateEvent(this.eventId, this.eventData).subscribe((resp: any) => {
      this.toolService.showMyAlert('success', resp.message);
      this.toolService.btnLoading = false;
      this.location.back();
    }, err => {
      this.toolService.showMyAlert('danger', err.error.error);
      this.toolService.btnLoading = false;
    })
  }

  onClear() {
    this.eventData = {
      title: null,
      subtitle: null,
      eventImg: null,
      dateTime: null,
      termsAndCondition: null,
      locationImg: null,
      location: null,
      // lat: null,
      // lng: null,
    }
    this.eventFile = null;
    this.locationFile = null;
  }






  // // Google Map

  // @ViewChild("placesRef") placesRef: GooglePlaceDirective;

  // getMyLocation() {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     this.eventData.lat = position.coords.latitude;
  //     this.eventData.lng = position.coords.longitude;
  //     this.markerDragEnd({ coords: { lat: this.eventData.lat, lng: this.eventData.lng } })
  //   });
  // }

  // onPlaceChange(address: Address) {
  //   this.eventData.location = address.formatted_address;
  //   this.eventData.lat = address.geometry.location.lat();
  //   this.eventData.lng = address.geometry.location.lng();
  // }

  // markerDragEnd(event) {
  //   this.eventData.lat = event.coords.lat;
  //   this.eventData.lng = event.coords.lng;
  //   this.getAddress();
  // }

  // getAddress() {
  //   var latlng = new google.maps.LatLng(this.eventData.lat, this.eventData.lng);
  //   var geocoder = new google.maps.Geocoder();
  //   geocoder.geocode({ 'latLng': latlng }, (results, status) => {
  //     if (status == google.maps.GeocoderStatus.OK) {
  //       this.eventData.location = (results[0].formatted_address);
  //     } else {
  //       this.toolService.showMyAlert('danger', status);
  //     }
  //   });
  // }




}

