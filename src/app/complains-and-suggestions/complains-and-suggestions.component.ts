import { Component, OnInit } from '@angular/core';
import { ToolService } from '../services/tool.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-complains-and-suggestions',
  templateUrl: './complains-and-suggestions.component.html',
  styleUrls: ['./complains-and-suggestions.component.scss']
})
export class ComplainsAndSuggestionsComponent implements OnInit {


  constructor(
    public toolService: ToolService,
    private dataService: DataService,
  ) {
    this.toolService.pageTitle = 'Complains And Suggestions';
  }

  contactUsId: any;
  rawContactUs = [];
  allContactUs = [];

  ngOnInit() {
    this.getContactUsData();
  }

  getContactUsData() {
    this.toolService.showLoading = true;
    this.dataService.getAllComplainsAndSuggestions().subscribe((resp: any) => {
      this.rawContactUs = resp;
      this.update();
      this.toolService.showLoading = false;
    })
  }


  messageIndex: any;

  messageReturner(message, index) {
    let result = {
      message: null,
      type: null,
    }
    if (message.length) {
      if (message.length < 120) {
        result.message = message;
        result.type = null;
      } else {
        if (this.messageIndex == index) {
          result.message = message;
          result.type = true;
        } else {
          result.message = message.substr(0, 120);
          result.type = false;
        }
      }
    }
    return result;
  }

  onDeleteContactUs() {
    this.dataService.deleteComplainsAndSuggestions(this.contactUsId).subscribe((resp: any) => {
      this.toolService.showMyAlert('success', resp.message);
      this.rawContactUs.splice((this.rawContactUs.findIndex(item => item.id == this.contactUsId)), 1);
      this.update();
    }, err => {
      this.toolService.showMyAlert('danger', err.error.message);
    })
  }


  // Sorting & Filtration of data
  update() {
    const data = this.rawContactUs;
    this.totalItems = data.length;
    this.sort(data);
    this.allContactUs = this.paginate(data);
  }
  searchKeys = ['id', 'subject', 'email', 'message', 'createdAt',];
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
