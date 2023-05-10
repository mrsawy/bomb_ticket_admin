import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

  url = environment.baseUrl;

  constructor(private http: HttpClient) {}
  
  sendToNumber(data) {
    return this.http.post(this.url + 'whatsapp/send', data);
  }

  sendToSellerById(data){
    
    return this.http.post(this.url + 'whatsapp/send-to-seller-by-id', data);

  }
   sendAfterPayment(data){
    
    return this.http.post(this.url + 'whatsapp/send-after-payment', data);

  }

  sendAfterApproval(data){
    
    return this.http.post(this.url + 'whatsapp/send-to-seller-after-approval', data);

  }
  sendAfterReejction(data){
    
    return this.http.post(this.url + 'whatsapp/send-to-seller-after-rejection', data);

  }

  sendAfterRejection(data){
    
    return this.http.post(this.url + 'whatsapp//send-to-seller-after-rejection', data);

  }

}
