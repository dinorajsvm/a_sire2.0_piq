import { Directive, ElementRef, HostListener } from '@angular/core';
@Directive({
  selector: '[digitDirective]'
})
export class DigitDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('input', ['$event']) onInputChange(event:any) {
    const initalValue = this._el.nativeElement.value;
    const sanitizedValue = initalValue.replace(/[^0-9.]+/g, '');
    const parts = sanitizedValue.split('.');
    parts[0] = parts[0].substring(0, 3);
    const limitedValue = parts.join('.');
    if (initalValue !== limitedValue) {
      this._el.nativeElement.value = limitedValue;
      event.stopPropagation();
    }
  }
}