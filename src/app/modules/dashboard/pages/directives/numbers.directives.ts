import { Directive, ElementRef, HostListener } from '@angular/core';
@Directive({
  selector: '[newmeric]'
})
export class NewmericDirective {
  constructor(private _el: ElementRef) { }
  @HostListener('input', ['$event']) onInputChange(event:any) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^0-9]+/i,'');
    if ( initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}