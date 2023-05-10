import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  url = environment.baseUrl;
  sliderUrl = environment.baseUrl + 'image/saveImages';

  constructor(
    private http: HttpClient,
  ) { }


  blockUnblockUser(blockData) {
    return this.http.post(this.url + 'user/block-user/' + blockData.userId, blockData);
  }

  getAllUsers() {
    return this.http.get(this.url + 'user/all-user');
  }

  getEvent(eventId) {
    return this.http.get(this.url + 'event/event/' + eventId);
  }

  getAllEvents() {
    return this.http.get(this.url + 'event/all-event-admin');
  }

  createEvent(data) {
    return this.http.post(this.url + 'event/create', data);
  }

  updateEvent(eventId, data) {
    return this.http.post(this.url + 'event/update/' + eventId, data);
  }

  deleteEvent(eventId) {
    return this.http.delete(this.url + 'event/del/' + eventId);
  }

  
  // getAllCoupons() {
  //   return this.http.get(this.url + 'coupon/all-coupon');
  // }

  createCoupon(data) {
    return this.http.post(this.url + 'coupon/create', data);
  }

  updateCoupon(couponId, data) {
    return this.http.post(this.url + 'coupon/update/' + couponId, data);
  }

  deleteCoupon(couponId) {
    return this.http.delete(this.url + 'coupon/del/' + couponId);
  }


  getAllCouponsWithQty() {
    return this.http.get(this.url + 'user-coupon/get-all-with-qty');
  }

  getAllUsersWithCoupon(couponId) {
    return this.http.get(this.url + 'user-coupon/get-all-users-with-coupon/' + couponId);
  }

  updateCouponBulkUsers(data) {
    let apiData = {
      couponId: data.couponId,
      userIds: [],
    }
    if (data.type == 'Assign') {
      apiData.userIds = data.assignUserIds;
      return this.http.post(this.url + 'user-coupon/assign-coupon-bulk-users', apiData);
    } else if (data.type == 'Unassign') {
      apiData.userIds = data.unassignUserIds;
      return this.http.post(this.url + 'user-coupon/unassign-coupon-bulk-users', apiData);
    }
  }

  getAllCouponsWithUserCoupon(userId) {
    return this.http.get(this.url + 'user-coupon/get-all-coupons-with-user-coupon/' + userId);
  }



  getAllOrders() {
    return this.http.get(this.url + 'order/get-all-order');
  }

  getOrderDetail(orderId) {
    return this.http.get(this.url + 'order/order-detail/' + orderId);
  }

  uploadFile(file) {
    const fd = new FormData();
    fd.append("image", file);
    return this.http.post(this.url + "image/saveImages", fd);
  }

  getPaidWithdrawals() {
    return this.http.get(this.url + 'withdraw/all-paid-admin');
  }

  getUnpaidWithdrawals() {
    return this.http.get(this.url + 'withdraw/all-unpaid-admin');
  }

  updateWithdraw(withdrawId, data) {
    return this.http.post(this.url + 'withdraw/update/' + withdrawId, data)
  }

  getAllSliders() {
    return this.http.get(this.url + 'slider/all-slider');
  }

  createSlider(data) {
    return this.http.post(this.url + 'slider/create', data);
  }

  deleteSlider(sliderId) {
    return this.http.delete(this.url + 'slider/del/' + sliderId);
  }

  getPendingTickets() {
    return this.http.get(this.url + 'ticket/all-pending');
  }

  getApprovedTickets() {
    return this.http.get(this.url + 'ticket/all-approved');
  }

  getSoldTickets() {
    return this.http.get(this.url + 'ticket/all-sold');
  }

  getRejectedTickets() {
    return this.http.get(this.url + 'ticket/all-rejected');
  }

  updateDeleteBulkTicket(data) {
    return this.http.post(this.url + 'ticketImg/update-delete-bulk', data);
  }

  updateTicket(ticketId, data) {
    return this.http.post(this.url + 'ticketImg/update/' + ticketId, data);
  }

  createTicketSec(data) {
    return this.http.post(this.url + 'ticketSection/create', data);
  }

  updateTicketSec(data) {
    return this.http.post(this.url + 'ticketSection/update/' + data.id, data);
  }

  deleteTicketSec(id) {
    return this.http.delete(this.url + 'ticketSection/del/' + id);
  }

  deleteTicket(ticketData) {
    return this.http.post(this.url + 'ticketImg/del-ticket', ticketData);
  }

  getAllPartners() {
    return this.http.get(this.url + 'partnerShip/all-partnerShip');
  }

  createPartner(data) {
    return this.http.post(this.url + 'partnerShip/create', data);
  }

  deletePartner(partnerId) {
    return this.http.delete(this.url + 'partnerShip/del/' + partnerId);
  }

  createAdmin(adminData) {
    return this.http.post(this.url + 'admin/create', adminData);
  }

  updateAdmin(adminData) {
    return this.http.post(this.url + 'admin/update', adminData);
  }

  changeAdminPassword(passwordData) {
    return this.http.post(this.url + 'admin/change-password', passwordData);
  }

  updateAdminPassword(passwordData) {
    return this.http.post(this.url + 'admin/update-password', passwordData);
  }

  deleteAdmin(adminId) {
    return this.http.delete(this.url + 'admin/delete/' + adminId);
  }

  getAllAdmins() {
    return this.http.get(this.url + 'admin/get-all');
  }

  loginAdmin(loginData) {
    return this.http.post(this.url + 'admin/login', loginData);
  }

  updatePercentage(percentData) {
    return this.http.post(this.url + 'admin/update-percentage', percentData);
  }

  getTicketPercentage() {
    return this.http.get(this.url + 'admin/get-percentage');
  }

  adminReturner() {
    let admin = localStorage.getItem('ticketsAdmin');
    if (admin) {
      return JSON.parse(admin);
    }
  }

  getAllComplainsAndSuggestions() {
    return this.http.get(this.url + 'complaintSuggestion/all-ComplaintAndSuggestion');
  }

  deleteComplainsAndSuggestions(id) {
    return this.http.delete(this.url + 'complaintSuggestion/delete/' + id);
  }


}
