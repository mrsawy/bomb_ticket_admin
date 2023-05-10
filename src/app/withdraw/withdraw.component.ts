import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../services/data.service';
import { ToolService } from '../services/tool.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss',
    '../../vendor/libs/spinkit/spinkit.scss']
})
export class WithdrawComponent implements OnInit {


  constructor(
    private modalService: NgbModal,
    private dataService: DataService,
    public toolService: ToolService,
    private activatedRoute: ActivatedRoute,
    public router: Router,
  ) {
    this.toolService.pageTitle = 'Withdraw';
  }

  modalType = 'withdraw';
  withdrawType = true;
  withdrawData = [];
  paidData = [];
  unPaidData = [];
  payModalData: any;

  ngOnInit() {
    this.checkRoute();
    this.getTicketPercentage();
  }

  checkRoute() {
    this.activatedRoute.params.subscribe((params: any) => {
      if (params.type == 'paid') {
        this.onClear();
        this.withdrawType = true;
        this.getPaidData();
      } else {
        this.onClear();
        this.withdrawType = false;
        this.getUnpaidData();
      }
    });
  }

  ticketTaxPercentage = 0;

  getTicketPercentage() {
    this.dataService.getTicketPercentage().subscribe((resp: any) => {
      if (resp.data) {
        this.ticketTaxPercentage = resp.data.percentage;
      }
    })
  }


  onClear() {
    this.toolService.showLoading = true;
    this.withdrawData = [];
  }

  async getPaidData() {
    await this.dataService.getPaidWithdrawals().subscribe((resp: any) => {
      this.paidData = resp;
      // if (resp.length !== 0) {
      //   this.paidData = resp.map(data => {
      //     return {
      //       id: data.id,
      //       amount: data.amount,
      //       isPaid: data.isPaid,
      //       userId: data.userId,
      //       phoneNumber: data.user ? data.user.phoneNumber : null,
      //       ibanNumber: data.user.banks ? (data.user.banks.length ? data.user.banks[0].ibanNumber : null) : null,
      //       bankName: data.user.banks ? (data.user.banks.length ? data.user.banks[0].bankName : null) : null,
      //       accountHolderName: data.user.banks ? (data.user.banks.length ? data.user.banks[0].accountHolderName : null) : null,
      //     }
      //   })
      // }
      this.update();
      this.toolService.showLoading = false;
    })
  }


  async getUnpaidData() {
    await this.dataService.getUnpaidWithdrawals().subscribe((resp: any) => {
      this.unPaidData = resp;
      // if (resp.length !== 0) {
      //   this.unPaidData = resp.map(data => {
      //     return {
      //       id: data.id,
      //       amount: data.amount,
      //       isPaid: data.isPaid,
      //       userId: data.userId,
      //       phoneNumber: data.user ? data.user.phoneNumber : null,
      //       ibanNumber: data.user.banks ? (data.user.banks.length ? data.user.banks[0].ibanNumber : null) : null,
      //       bankName: data.user.banks ? (data.user.banks.length ? data.user.banks[0].bankName : null) : null,
      //       accountHolderName: data.user.banks ? (data.user.banks.length ? data.user.banks[0].accountHolderName : null) : null,
      //     }
      //   })
      // }
      this.update();
      this.toolService.showLoading = false;
    })
  }

  openModal(content, type, item) {
    this.modalType = type;
    this.payModalData = item;
    this.modalService.open(content, { centered: true });
  }

  onPayWithdraw() {
    this.toolService.btnLoading = true;
    let payId = this.payModalData.id;
    let payData = {
      status: 'Accepted'
    }
    this.dataService.updateWithdraw(payId, payData).subscribe((resp: any) => {
      this.payModalData.isPaid = true;
      this.paidData.push(this.payModalData);
      this.unPaidData.splice(this.unPaidData.findIndex(item => item.id == payId), 1);
      this.update();
      this.toolService.btnLoading = false;
      this.modalService.dismissAll();
      this.toolService.showMyAlert('success', resp.message);
    }, err => {
      this.toolService.btnLoading = false;
      this.toolService.showMyAlert('danger', err.error.error);
    })
  }


  userDataReturn(item) {
    let result = {
      name: null,
      email: null,
      phoneNumber: null,
    }
    if (item) {
      if (item.user) {
        result = {
          name: item.user.firstName + ' ' + item.user.lastName,
          email: item.user.email,
          phoneNumber: item.user.phoneNumber,
        }
      }
    }
    return result;
  }

  bankDataReturn(item) {
    let result = {
      accountHolderName: null,
      bankName: null,
      ibanNumber: null,
    }
    if (item) {
      if (item.user) {
        if (item.user.banks) {
          if (item.user.banks[0]) {
            result = {
              accountHolderName: item.user.banks[0].accountHolderName,
              bankName: item.user.banks[0].bankName,
              ibanNumber: item.user.banks[0].ibanNumber,
            }
          }
        }
      }
    }
    return result;
  }

  // sumAmountsReturn(data) {
  //   let total = 0;
  //   if (data) {
  //     if (data.user) {
  //       if (data.user.orders) {
  //         let elemArray = data.user.orders;
  //         elemArray.forEach(item => {
  //           if (typeof (item.price) == 'string') {
  //             total += JSON.parse(item.price);
  //           } else if (typeof (item.price) == 'number') {
  //             total += item.price;
  //           }
  //         });
  //       }
  //     }
  //   }
  //   return total;
  // }


  // Filter and Sorting

  searchKeys = ['id', 'phoneNumber'];
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
    if (this.withdrawType) {
      const data = this.paidData;
      this.totalItems = data.length;
      this.sort(data);
      this.withdrawData = this.paginate(data);
    } else {
      const data = this.unPaidData;
      this.totalItems = data.length;
      this.sort(data);
      this.withdrawData = this.paginate(data);
    }
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




