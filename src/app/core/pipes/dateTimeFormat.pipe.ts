import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { MomentService } from '../services/moment/moment.service';

@Pipe({
  name: 'dateTimeFormat'
})
export class DateTimeFormatPipe implements PipeTransform {

  constructor(private _momentService:MomentService){
  }

  transform(value: any, args?: any): any {
    let date = new Date(value);
    let offset = new Date().getTimezoneOffset();
    return moment(date).utcOffset(offset, true).format(this._momentService.getCurrentDateFormat());

  }

}
