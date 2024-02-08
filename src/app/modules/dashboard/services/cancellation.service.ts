import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CancellationService {
  private cancelSubject = new Subject<void>();

  get cancelSignal() {
    return this.cancelSubject.asObservable();
  }

  cancel() {
    this.cancelSubject.next();
  }
}