import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../services/data.service';
import { ToolService } from '../services/tool.service';


@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss',
    '../../vendor/libs/spinkit/spinkit.scss']
})
export class EventsComponent implements OnInit {


  constructor(
    public modalService: NgbModal,
    public dataService: DataService,
    private router: Router,
    public toolService: ToolService,
  ) {
    this.toolService.pageTitle = 'Events';
  }

  ngOnInit() {
    this.toolService.showLoading = true;
    this.getEventsData();
    this.update();
  }

  allEventsData = [];
  eventsData = [];
  tacModalTitle: any;
  eventModalData: any;

  getEventsData() {
    this.dataService.getAllEvents().subscribe((resp: any) => {
      this.allEventsData = resp;
      this.update();
      this.toolService.showLoading = false;
    })
  }


  // timeReturner(dateTime) {
  //   let time = dateTime.substring(11, 16);
  //   let hours = time.substring(0, 2);
  //   let newHours = null;
  //   let newTime = null;
  //   let zone = null;
  //   if (hours < 12) {
  //     zone = 'AM'
  //     newTime = time + ' ' + zone;
  //   } else if (hours == 12) {
  //     zone = 'PM'
  //     newTime = time + ' ' + zone;
  //   } else if (hours > 12) {
  //     zone = 'PM'
  //     newHours = JSON.stringify(JSON.parse(hours) - 12);
  //     newTime = time.replace(hours, newHours) + ' ' + zone;
  //   }
  //   return newTime;
  // }

  createEvent() {
    this.router.navigate(['/createevent']);
  }

  dialogOptions = { title: 'Are you sure?', text: 'You won\'t be able to revert this!', type: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete it!', showCloseButton: true, confirmButtonClass: 'btn btn-lg btn-warning' }


  onDeleteEvent() {
    let myEventId = this.eventModalData.id;
    this.dataService.deleteEvent(myEventId).subscribe((resp: any) => {
      this.allEventsData.splice(this.allEventsData.findIndex(item => item.id == myEventId), 1);
      this.update();
      this.toolService.showMyAlert('success', resp.message);
    }, err => {
      this.toolService.showMyAlert('danger', err.error.error);
    })
  }


  openModal(content, item) {
    this.eventModalData = item;
    this.sectionData = {
      id: null,
      name: null,
      eventId: item.id,
    }
    this.modalService.open(content, {centered:true});
  }

  sectionData = {
    id: null,
    name: null,
    eventId: null,
  }

  clearSectionData() {
    this.sectionData = {
      id: null,
      name: null,
      eventId: this.eventModalData.id,
    }
  }


  createTicketSection() {
    this.dataService.createTicketSec(this.sectionData).subscribe((resp: any) => {
      for (let i = 0; i < this.eventsData.length; i++) {
        if (this.eventsData[i].id == this.eventModalData.id) {
          let dataObj = resp.ticketSection;
          dataObj['sell_tickets'] = [];
          this.clearSectionData();
          this.eventsData[i].ticket_sections.push(dataObj);
        }
      }
      this.toolService.showMyAlert('success', resp.message);
    }, err => {
      this.toolService.showMyAlert('danger', err.error.error);
    })
  }

  updateTicketSection() {
    this.dataService.updateTicketSec(this.sectionData).subscribe((resp: any) => {
      // for (let i = 0; i < this.eventsData.length; i++) {
      //   if (this.eventsData[i].id == this.eventModalData.id) {
      //     let dataObj = resp.ticketSection;
      //     dataObj['sell_tickets'] = [];
      //     this.clearSectionData();
      //     this.eventsData[i].ticket_sections.push(dataObj);
      //   }
      // }
      this.clearSectionData();
      this.toolService.showMyAlert('success', resp.message);
    }, err => {
      this.toolService.showMyAlert('danger', err.error.error);
    })
  }


  deleteTicketSection() {
    this.dataService.deleteTicketSec(this.sectionData.id).subscribe((resp: any) => {
      for (let ind = 0; ind < this.allEventsData.length; ind++) {
        if (this.allEventsData[ind].id == this.eventModalData.id) {
          let ticketSection = this.eventsData[ind].ticket_sections;
          ticketSection.splice(ticketSection.findIndex(item => item.id == this.sectionData.id), 1);
          this.update()
        }
      }
      this.toolService.showMyAlert('success', resp.message);
    }, err => {
      this.toolService.showMyAlert('danger', err.error.error);
    })
  }


  // Sorting & Filteration of data
  update() {
    const data = this.filter(this.allEventsData);
    this.totalItems = data.length;
    this.sort(data);
    this.eventsData = this.paginate(data);
  }
  searchKeys = ['id', 'title', 'subtitle', 'location', 'dateTime'];
  sortBy = 'id';
  sortDesc = true;
  perPage = 10;
  filterVal = '';
  currentPage = 1;
  totalItems = 0;
  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }
  filter(data) {
    const filter = this.filterVal.toLowerCase();
    return !filter ?
      data.slice(0) :
      data.filter(d => {
        return Object.keys(d)
          .filter(k => this.searchKeys.includes(k))
          .map(k => String(d[k]))
          .join('|')
          .toLowerCase()
          .indexOf(filter) !== -1 || !filter;
      });
  }
  sort(data) {
    data.sort((a: any, b: any) => {
      a = typeof (a[this.sortBy]) === 'string' ? a[this.sortBy].toUpperCase() : a[this.sortBy];
      b = typeof (b[this.sortBy]) === 'string' ? b[this.sortBy].toUpperCase() : b[this.sortBy];
      if (a < b) { return this.sortDesc ? 1 : -1; }
      if (a > b) { return this.sortDesc ? -1 : 1; }
      return 0;
    });
  }
  paginate(data) {
    const perPage = parseInt(String(this.perPage), 10);
    const offset = (this.currentPage - 1) * perPage;
    return data.slice(offset, offset + perPage);
  }
  setSort(key) {
    if (this.sortBy !== key) {
      this.sortBy = key;
      this.sortDesc = false;
    } else {
      this.sortDesc = !this.sortDesc;
    }
    this.currentPage = 1;
    this.update();
  }

}
