import { Injectable } from '@angular/core';
import { javaDateToMomentService } from '../javaDateToMoment/javaDateToMoment.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MomentService {

  constructor(private dateConverter:javaDateToMomentService) { }

  getFormattedDate(date:any){​​​​
    let offset = new Date().getTimezoneOffset();
    return moment(new Date(date)).utcOffset(offset, true).format(this.getCurrentDateFormat());
  }​​​​

  getFormattedDateYYYYMMDD(date:any){​​​​    
    return moment(new Date(date)).format('YYYY-MM-DD');
  }
  
  getFormattedDateDDMMYYYY(date:any){​​​​    
    return moment(new Date(date)).format('DD-MM-YYYY');
  }​​​​

  getCurrentDateFormat() {
    let user:any  = JSON.parse(localStorage.getItem("user") || '{}');
    let dateFormat = user?.dateFormat;
    return this.dateConverter.toMomentFormatString(dateFormat);
  }
  getCurrentUserDate() {
    let user:any  = JSON.parse(localStorage.getItem("user") || '{}');
    let dateFormat = user?.dateFormat;
    const dataSplitValue = dateFormat.split(" ");
    const dateValue = dataSplitValue[0];
    return this.dateConverter.toMomentFormatString(dateValue);
  }
}
