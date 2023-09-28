import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({providedIn: 'root'})
export class FormValidatorService {
  autocompleteObjectValidator(control: AbstractControl) {
    const selection: any = control.value;
    if (selection) {
      if (typeof selection === 'string' && (selection.trim())) {
        return { incorrect: true };
      }
    }
    return null;
  }
}
