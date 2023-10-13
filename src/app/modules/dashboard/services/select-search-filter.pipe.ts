import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selectSearchFilter'
})
export class selectSearchPipe implements PipeTransform {
  transform(items: any[], filterText: string): any[] {
    if (!filterText || filterText?.trim() === '') {
      return items;
    }

    return items.filter(vsl =>
        vsl.vesselname.toLowerCase().includes(filterText?.toLowerCase())
    );
  }
}
