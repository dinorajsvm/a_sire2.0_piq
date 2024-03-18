import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphanumeric]'
})
export class AlphanumericDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const sanitizedValue = inputElement.value.replace(/[^a-zA-Z0-9\s]/g, '');
    if (sanitizedValue !== inputElement.value) {
      inputElement.value = sanitizedValue;
      inputElement.dispatchEvent(new Event('input'));
    }
  }
}
