import { Directive, ElementRef } from '@angular/core';
import { CustomCurrencyPipe } from '../../pipes/custom-currency/custom-currency';

@Directive({
  selector: '[custom-ion-input-currency-mask]',
  host: {
    '(blur)': 'updateMask($event)',
    // '(change)': 'updateMask($event)',
    // '(focusout)': 'updateMask($event)',
  }
})
export class CustomIonInputCurrencyMaskDirective {

  private triggered: boolean;
  private el: HTMLInputElement;

  constructor(
    private currencyPipe: CustomCurrencyPipe,
    private elementRef: ElementRef
  ) {
    this.el = this.elementRef.nativeElement;
    this.triggered = false;
    //console.log('Hello CustomIonInputCurrencyMaskDirective Directive');
  }

  updateMask(e) {
    if (!this.triggered) {
      this.triggered = true;

      this.setMask(e);

      this.triggered = false;
    }
  }

  setMask(e) {
    try {
      //console.log('before: ' + e.target.value);
      this.el.value = this.currencyPipe.transform(e.target.value);
      e.target.value = this.el.value;

      //console.log('after: ' + e.target.value);
    } catch (ex) {
      console.error(ex.message);
    }
  }
}
