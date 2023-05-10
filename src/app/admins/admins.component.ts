import { Component, OnInit } from '@angular/core';
import { ToolService } from '../services/tool.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-admins',
  templateUrl: './admins.component.html',
  styleUrls: ['./admins.component.scss']
})
export class AdminsComponent implements OnInit {

  constructor(
    public toolService: ToolService,
    private ngbModal: NgbModal,
    public dataService: DataService,
  ) {
    this.toolService.pageTitle = 'Admins';
  }

  modalType = 'create';
  adminData = {
    id: null,
    name: null,
    email: null,
    phoneNumber: null,
    profilePhoto: null,
    password: null,
    confirmPassword: null,
  }
  percentageData = {
    percentage: 0,
  }
  rawAdmins = [];
  allAdmins = [];

  ngOnInit() {
    this.getAdminsData();
    this.getPercentageData();
  }

  getPercentageData() {
    this.dataService.getTicketPercentage().subscribe((resp: any) => {
      this.percentageData = resp.data;
    })
  }

  getAdminsData() {
    this.toolService.showLoading = true;
    this.dataService.getAllAdmins().subscribe((resp: any) => {
      this.rawAdmins = resp.admins;
      this.update();
      this.toolService.showLoading = false;
    })
  }

  openModal(content, type, item) {
    if (type == 'edit') {
      this.adminData = item;
    } else if (type == 'create') {
      this.modalType = 'create';
      this.adminData = {
        id: null,
        name: null,
        email: null,
        phoneNumber: null,
        profilePhoto: null,
        password: null,
        confirmPassword: null,
      }
      this.selectedFile = null;
    }
    this.modalType = type;
    this.ngbModal.open(content, { centered: true });
  }

  formValid() {
    let result = null;
    if (this.modalType == 'create') {
      if (this.adminData.name && this.adminData.email && this.adminData.phoneNumber && this.adminData.password && this.adminData.confirmPassword) {
        result = true;
      } else {
        result = false;
      }
    } else if (this.modalType == 'edit') {
      if (this.adminData.name && this.adminData.email && this.adminData.phoneNumber) {
        result = true;
      } else {
        result = false;
      }
    } else if (this.modalType == 'password') {
      if (this.adminData.password && this.adminData.confirmPassword) {
        result = true;
      } else {
        result = false;
      }
    }

    return result;
  }

  selectedFile: any;

  processFile(event) {
    let files = event.target.files
    if (files.length > 0) {
      this.selectedFile = files[0];
    }
  }

  changePass() {
    if (this.modalType == 'edit') {
      this.adminData.password = null;
      this.adminData.confirmPassword = null;
      this.modalType = 'password';
    } else {
      this.modalType = 'edit';
    }
  }

  onUpdatePercentage() {
    this.toolService.btnLoading = true;
    this.dataService.updatePercentage(this.percentageData).subscribe((resp: any) => {
      this.toolService.showMyAlert('success', resp.message);
      this.ngbModal.dismissAll();
      this.toolService.btnLoading = false;
    }, err => {
      this.toolService.showMyAlert('danger', err.error.message);
      this.toolService.btnLoading = false;
    })
  }

  onBtnClick() {
    if (this.modalType == 'create') {
      this.onCreateAdmin();
    } else if (this.modalType == 'edit') {
      this.onUpdateAdmin();
    } else if (this.modalType == 'password') {
      this.onUpdatePassword();
    }
  }

  onCreateAdmin() {
    if (this.adminData.password == this.adminData.confirmPassword) {
      if (this.formValid()) {
        this.toolService.btnLoading = true;
        if (this.selectedFile) {
          this.dataService.uploadFile(this.selectedFile).subscribe((fileName: any) => {
            this.adminData.profilePhoto = fileName;
            this.createAdminData();
          })
        } else {
          this.createAdminData();
        }
      } else {
        this.toolService.showMyAlert('warning', 'Please fill all the details!');
      }
    } else {
      this.toolService.showMyAlert('warning', 'Password not match!');
    }
  }

  createAdminData() {
    this.dataService.createAdmin(this.adminData).subscribe((resp: any) => {
      this.toolService.showMyAlert('success', resp.message);
      this.rawAdmins.push(resp.admin);
      this.update();
      this.ngbModal.dismissAll();
      this.toolService.btnLoading = false;
    }, err => {
      this.toolService.showMyAlert('danger', err.error.message);
      this.toolService.btnLoading = false;
    })
  }

  onUpdateAdmin() {
    if (this.formValid()) {
      this.toolService.btnLoading = true;
      if (this.selectedFile) {
        this.dataService.uploadFile(this.selectedFile).subscribe((fileName: any) => {
          this.adminData.profilePhoto = fileName;
          this.updateAdminData();
        })
      } else {
        this.updateAdminData();
      }
    } else {
      this.toolService.showMyAlert('warning', 'Please fill all the details!');
    }
  }

  updateAdminData() {
    this.dataService.updateAdmin(this.adminData).subscribe((resp: any) => {
      this.toolService.showMyAlert('success', resp.message);
      this.ngbModal.dismissAll();
      this.toolService.btnLoading = false;
    }, err => {
      this.toolService.showMyAlert('danger', err.error.message);
      this.toolService.btnLoading = false;
    })
  }


  onUpdatePassword() {
    if (this.adminData.password == this.adminData.confirmPassword) {
      this.toolService.btnLoading = true;
      this.dataService.updateAdminPassword(this.adminData).subscribe((resp: any) => {
        this.toolService.showMyAlert('success', resp.message);
        this.ngbModal.dismissAll();
        this.toolService.btnLoading = false;
      }, err => {
        this.toolService.showMyAlert('danger', err.error.message);
        this.toolService.btnLoading = false;
      })
    } else {
      this.toolService.showMyAlert('warning', 'Password not match!');
    }
  }


  onDeleteAdmin() {
    this.dataService.deleteAdmin(this.adminData.id).subscribe((resp: any) => {
      this.toolService.showMyAlert('success', resp.message);
      this.rawAdmins.splice((this.rawAdmins.findIndex(item => item.id == this.adminData.id)), 1);
      this.update();
    }, err => {
      this.toolService.showMyAlert('danger', err.error.message);
    })
  }


  // Sorting & Filtration of data
  update() {
    const data = this.filter(this.rawAdmins);
    this.totalItems = data.length;
    this.sort(data);
    this.allAdmins = this.paginate(data);
  }
  searchKeys = ['id', 'name', 'email', 'phoneNumber', 'isSuper', 'createdAt',];
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
