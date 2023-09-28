import { DatePipe } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";
import * as moment from "moment";


@Pipe({name: 'customDateFormat'})
export class CustomDateFormatPipe implements PipeTransform {
    transform(dateValue: any) {
        var datePipe = new DatePipe("en-US");
        dateValue = datePipe.transform(dateValue, 'dd/MM/yy');
         return dateValue;
     }
}
@Pipe({
    name: 'dateTimeUTCFormat'
  })
  export class DateTimeUTCFormatPipe implements PipeTransform {
    transform(value: any, args?: any): any {
      const dateFormat = 'DD MMM YYYY HH:mm';
      const utcTime = moment.utc(value).toDate();
      const localTime = moment(utcTime).local();
      return localTime.format(dateFormat);

    }
  }