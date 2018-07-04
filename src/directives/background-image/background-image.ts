import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[background-image]' // Attribute selector
})
export class BackgroundImageDirective {
  private el: HTMLElement;

  constructor(el: ElementRef) {
    this.el = el.nativeElement;
  }

  @Input('background-image') backgroundImage: string;

  ngAfterViewInit() {
    this.el.style.backgroundImage = 'url(' + encodeURI(this.backgroundImage) + ')';
  }
}
