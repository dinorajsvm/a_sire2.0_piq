import { Directive, ElementRef, HostListener } from '@angular/core';
@Directive({
  selector: '[numberSpecDirective]',
})
export class NumberSpecDirective {
  constructor(private _el: ElementRef) {}
  @HostListener('input', ['$event']) onInputChange(event: any) {
    const initalValue = this._el.nativeElement.value;
    const sanitizedValue = initalValue.replace(/[^0-9.]+/g, '');
    const numericValue = parseInt(sanitizedValue, 10);
    if (isNaN(numericValue) || numericValue < 0 || numericValue > 48) {
      // If the value is not in the desired range, set it to 0 or 48 accordingly
      this._el.nativeElement.value = Math.min(48, Math.max(0, numericValue));
      event.stopPropagation();
    }
  }
}
