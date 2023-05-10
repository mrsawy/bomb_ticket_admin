import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../services/data.service';
import { ToolService } from '../services/tool.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss',
    '../../vendor/libs/spinkit/spinkit.scss']
})
export class UsersComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    public dataService: DataService,
    public toolService: ToolService,
  ) {
    this.toolService.pageTitle = 'Users';
  }

  allUsersData = []
  usersData = [];

  userName: any;
  bankDetail = [];
  addressDetail = [];

  ngOnInit() {
    this.toolService.showLoading = true;
    this.getUsersData();
  }

  getUsersData() {
    this.dataService.getAllUsers().subscribe((resp: any) => {
      this.allUsersData = resp;
      this.update();
      this.toolService.showLoading = false;
    })
  }

  openModal(content, type, item) {
    this.userName = item.firstName;
    if (type == 'address') { this.addressDetail = item.addresses; };
    if (type == 'bank') { this.bankDetail = item.banks; };
    this.modalService.open(content, { centered: true });
  }


  onBlockUnblock(userId, event) {
    let isBlocked = event.target.checked;
    let blockData = {
      userId: userId,
      isBlocked: isBlocked,
    }
    this.dataService.blockUnblockUser(blockData).subscribe((resp: any) => {
      this.toolService.showMyAlert('success', resp.message);
      this.update();
    }, err => {
      this.toolService.showMyAlert('danger', err.error.message);
    });
  }



  // Sorting & Filteration of data

  update() {
    const data = this.filter(this.allUsersData);
    this.totalItems = data.length;
    this.sort(data);
    this.usersData = this.paginate(data);
  }

  searchKeys = ['id', 'firstName', 'lastName', 'email', 'phoneNumber', 'gender'];
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
