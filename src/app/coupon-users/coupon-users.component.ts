import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../services/data.service';
import { ToolService } from '../services/tool.service';

@Component({
  selector: 'app-coupon-users',
  templateUrl: './coupon-users.component.html',
  styleUrls: ['./coupon-users.component.scss',
  '../../vendor/libs/spinkit/spinkit.scss']
})
export class CouponUsersComponent implements OnInit {

  constructor(
    public toolService: ToolService,
    public dataService: DataService,
    private activatedRoute: ActivatedRoute,
    public location: Location,
  ) {
    this.toolService.pageTitle = 'Coupon Users';
  }

  couponId: any;
  usersCouponRawList = [];
  usersCouponData = [];

  bulkCouponData = {
    couponId: null,
    assignUserIds: [],
    unassignUserIds: [],
    type: null,
  };


  ngOnInit() {
    this.toolService.showLoading = true;
    this.couponId = this.bulkCouponData.couponId = this.activatedRoute.snapshot.params.couponId;
    this.getUsersCouponData(this.couponId);
  }


  getUsersCouponData(couponId) {
    this.dataService.getAllUsersWithCoupon(couponId).subscribe((resp: any) => {
      this.usersCouponRawList = resp.usersData.map(item => {
        item['couponStatus'] = this.itemCouponReturn(item);
        return item;
      });
      this.update();
      this.toolService.showLoading = false;
    })
  }

  itemCouponReturn(item) {
    let result = null;
    if (item && item.user_coupons && item.user_coupons[0] && item.user_coupons[0].status) {
      result = item.user_coupons[0].status;
    }
    return result;
  }

  @ViewChild('confirmDialog') confirmDialog;

  changeBulkData(type) {
    this.bulkCouponData.type = type;
    if ((type == 'Assign' && this.bulkCouponData.assignUserIds.length) || (type == 'Unassign' && this.bulkCouponData.unassignUserIds.length)) {
      this.confirmDialog.show();
    } else {
      this.toolService.showMyAlert('warning', `Please select some Users to ${type}!`);
    }
  }


  onSelectCoupon(id, event, type) {
    let value = event.target.checked;
    if (value) {
      if (type == 'Assign') {
        this.bulkCouponData.assignUserIds.push(id);
      } else if (type == 'Unassign') {
        this.bulkCouponData.unassignUserIds.push(id);
      }
    } else {
      if (type == 'Assign') {
        this.bulkCouponData.assignUserIds.splice(this.bulkCouponData.assignUserIds.findIndex(item => item.id == id), 1);
      } else if (type == 'Unassign') {
        this.bulkCouponData.unassignUserIds.splice(this.bulkCouponData.unassignUserIds.findIndex(item => item.id == id), 1);
      }
    }
  }

  onUpdateBulk() {
    this.dataService.updateCouponBulkUsers(this.bulkCouponData).subscribe((resp: any) => {
      this.toolService.showMyAlert('success', resp.message);
      this.usersCouponRawList.map(item => {
        if (this.bulkCouponData.type == 'Assign') {
          if (this.bulkCouponData.assignUserIds.includes(item.id)) {
            item.couponStatus = 'active';
          }
        } else if (this.bulkCouponData.type == 'Unassign') {
          if (this.bulkCouponData.unassignUserIds.includes(item.id)) {
            item.couponStatus = '';
          }
        }
        return item;
      })
      this.bulkCouponData = {
        couponId: this.couponId,
        assignUserIds: [],
        unassignUserIds: [],
        type: null,
      };

      this.update();
    }, err => {
      this.toolService.showMyAlert('danger', err.error.message);
    })
  }



  // Sorting & Filteration of data
  update() {
    const data = this.filter(this.usersCouponRawList);
    this.totalItems = data.length;
    this.sort(data);
    this.usersCouponData = this.paginate(data);
  }
  searchKeys = ['id', , 'firstName', 'lastName', 'email', 'phoneNumber', 'createdAt', 'couponStatus'];
  sortBy = 'id';
  sortDesc = true;
  perPage = 5;
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


