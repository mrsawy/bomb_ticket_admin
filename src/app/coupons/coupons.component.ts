import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../services/data.service';
import { ToolService } from '../services/tool.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss',
    '../../vendor/libs/spinkit/spinkit.scss']
})
export class CouponsComponent implements OnInit {



  constructor(
    private modalService: NgbModal,
    private dataService: DataService,
    public toolService: ToolService,
  ) {
    this.toolService.pageTitle = 'Coupons';
  }

  couponType = true;
  allCouponsData = [];
  couponsData = [];

  couponId: any;
  couponModalData = {
    name: null,
    percentOff: null,
    // limit: null,
  }

  ngOnInit() {
    this.toolService.showLoading = true;
    this.getCouponsData();
  }

  showValidation = false;

  getCouponsData() {
    this.dataService.getAllCouponsWithQty().subscribe((resp: any) => {
      this.allCouponsData = resp.couponData;
      this.update();
      this.toolService.showLoading = false;
    })
  }

  openModal(content) {
    this.modalService.open(content, { centered: true });
  }

  onCreate(content) {
    this.couponType = true;
    this.onClear();
    this.openModal(content);
  }

  onClear() {
    this.couponModalData = {
      name: '',
      percentOff: null,
      // limit: null,
    }
  }

  validReturner(input) {
    let name = this.couponModalData.name;
    let percent = this.couponModalData.percentOff;
    // let limit = this.couponModalData.limit;
    if (this.showValidation) {
      if (input == 'name') {
        let space = name.includes(' ');
        if (name && !space) { return 'is-valid'; } else { return 'is-invalid'; }
      }
      if (input == 'percent') {
        if (percent > 0 && percent < 100) { return 'is-valid'; } else { return 'is-invalid'; }
      }
      // if (input == 'limit') {
      //   if (limit > 0) { return 'is-valid'; } else { return 'is-invalid'; }
      // }
    }
  }

  inputReturner() {
    let name = this.couponModalData.name;
    let percent = this.couponModalData.percentOff;
    // let limit = this.couponModalData.limit;
    let space = name.includes(' ');
    if (name && !space && percent > 0 && percent < 100
      //  && limit > 0
    ) {
      return true;
    } else {
      this.showValidation = true;
      return false;
    }
  }

  onEdit(content, item) {
    this.couponType = false;
    let myCoupon = item;
    this.couponId = myCoupon.id;
    this.couponModalData = myCoupon;
    this.openModal(content);
  }

  onCreateCoupon() {
    if (this.inputReturner()) {
      this.toolService.btnLoading = true;
      this.dataService.createCoupon(this.couponModalData).subscribe((resp: any) => {
        this.allCouponsData.push(resp.coupon);
        this.modalService.dismissAll();
        this.toolService.showMyAlert('success', resp.message);
        this.toolService.btnLoading = false;
        this.update();
        this.onClear();
      }, err => {
        this.toolService.showMyAlert('danger', err.error.error);
        this.toolService.btnLoading = false;
      })
    } else {
      this.toolService.showMyAlert('warning', 'Please fill all the details!')
    }
  }

  onUpdateCoupon() {
    if (this.inputReturner()) {
      this.toolService.btnLoading = true;
      this.dataService.updateCoupon(this.couponId, this.couponModalData).subscribe((resp: any) => {
        this.modalService.dismissAll();
        this.toolService.showMyAlert('success', resp.message);
        this.toolService.btnLoading = false;
      }, err => {
        this.toolService.showMyAlert('danger', err.error.error);
        this.toolService.btnLoading = false;
      })
    } else {
      this.toolService.showMyAlert('warning', 'Please fill all the details!')
    }
  }

  dialogOptions = { title: 'Are you sure?', text: 'You won\'t be able to revert this!', type: 'warning', showCancelButton: true, confirmButtonText: 'Yes, delete it!', showCloseButton: true, confirmButtonClass: 'btn btn-lg btn-warning' }

  couponDelId: any;

  onDelete(item) {
    this.couponDelId = item.id;;
  }

  onDeleteCoupon() {
    let myCouponId = this.couponDelId;
    this.dataService.deleteCoupon(myCouponId).subscribe((resp: any) => {
      this.allCouponsData.splice(this.allCouponsData.findIndex(item => item.id == myCouponId), 1);
      this.toolService.showMyAlert('success', resp.message);
      this.update();
    }, err => {
      this.toolService.showMyAlert('danger', err.error.error);
    })
  }



  // Filter and Sorting

  searchKeys = ['id', 'name', 'percentOff', 'limit',];
  sortBy = 'id';
  sortDesc = true;
  perPage = 10;

  filterVal = '';
  currentPage = 1;
  totalItems = 0;

  get totalPages() {
    return Math.ceil(this.totalItems / this.perPage);
  }

  update() {
    const data = this.filter(this.allCouponsData);
    this.totalItems = data.length;
    this.sort(data);
    this.couponsData = this.paginate(data);
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
