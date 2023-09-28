import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'chipFilter'
})
export class ChipFilterPipe implements PipeTransform {
  transform(items: string[], filterText: string): string[] {
    if (!filterText || filterText?.trim() === '') {
      return items;
    }

    return items.filter(selecVal =>
      selecVal.toLowerCase().includes(filterText?.toLowerCase())
    );
  }
}
