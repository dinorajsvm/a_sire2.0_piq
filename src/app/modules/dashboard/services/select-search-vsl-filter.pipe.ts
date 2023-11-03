import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selectSearchVslFilter'
})
export class selectSearchVslPipe implements PipeTransform {
  transform(items: any[], filterText: string): any[] {
    if (!filterText || filterText?.trim() === '') {
      return items;
    }

    return items.filter(vsl =>
        vsl.vesseltypename.toLowerCase().includes(filterText?.toLowerCase())
    );
    
  }
}
