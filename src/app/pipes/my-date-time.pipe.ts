import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'myDateTime'
})
export class MyDateTimePipe implements PipeTransform {

  constructor(
    private datePipe: DatePipe,
  ) { }

  transform(value: any, args?: any): any {
    let result = null;
    if (value) {
      result = this.datePipe.transform(value, 'MMM d, y, h:mm a', '+00:00');;
    }
    return result;
  }

  // dateReturner(date) {
  //   let result = null;
  //   if (date) {
  //     result = this.datePipe.transform(date, 'mediumDate');
  //   }
  //   return result;
  // }

  // timeReturner(date) {
  //   let result = null;
  //   if (date) {
  //     let dateTime = new Date(date);
  //     let hours = dateTime.getUTCHours();
  //     let minutes = dateTime.getUTCMinutes();
  //     let newMinutes = null;
  //     if (minutes < 10) {
  //       newMinutes = '0' + minutes;
  //     } else if (minutes == 0) {
  //       newMinutes = '00';
  //     } else {
  //       newMinutes = minutes;
  //     }
  //     let zone = null;
  //     if (hours == 0) {
  //       zone = 'AM'
  //       result = `12:${newMinutes} ${zone}`;
  //     } else if (hours < 12) {
  //       zone = 'AM'
  //       result = `${hours}:${newMinutes} ${zone}`;
  //     } else if (hours == 12) {
  //       zone = 'PM'
  //       result = `${hours}:${newMinutes} ${zone}`;
  //     } else if (hours > 12) {
  //       zone = 'PM'
  //       result = `${hours - 12}:${newMinutes} ${zone}`;
  //     }
  //   }
  //   return result;
  // }

}
