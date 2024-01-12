import { Directive, ElementRef, HostListener } from '@angular/core';
@Directive({
  selector: '[numberSpecDirective]',
})
export class NumberSpecDirective {
  constructor(private _el: ElementRef) {}
  @HostListener('input', ['$event']) onInputChange(event: any) {
    const inputValue = this._el.nativeElement.value;
    if (/^\d+$/.test(inputValue)) {
      const numericValue = parseInt(inputValue.replace(/^0+/, ''), 10);
      if (isNaN(numericValue) || numericValue < 0 || numericValue > 48) {
        this._el.nativeElement.value = inputValue.slice(0, -1);
        event.preventDefault();
      }
    } else {
      this._el.nativeElement.value = this._el.nativeElement.value.replace(/[^0-9]/g, '');
      event.preventDefault();
    }
  }
}
