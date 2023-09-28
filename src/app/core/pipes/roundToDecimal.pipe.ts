import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'roundToDecimal'
})

export class RoundToDecimalPipe implements PipeTransform {
  
  transform(value: any, args?: any): any {
    return (Math.round(value * 10)/10).toFixed(1);
  }

}
