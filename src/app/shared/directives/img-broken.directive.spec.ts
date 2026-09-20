import { ElementRef } from '@angular/core';
import { ImgBrokenDirective } from './img-broken.directive';

describe('ImgBrokenDirective', () => {

  it('should create an instance', () => {
    const mockElement = new ElementRef('')
    const directive = new ImgBrokenDirective(mockElement);
    expect(directive).toBeTruthy();
  });

  it('should replace image src with customImg when image fails to load', () => {
    const mockDiv = document.createElement('div');
    mockDiv.innerHTML = '<img src="broken.jpg" />';
    const imgElement = mockDiv.querySelector('img') as HTMLImageElement;
    const elementRef = new ElementRef(imgElement);

    const directive = new ImgBrokenDirective(elementRef);
    directive.customImg = 'fallback.jpg';

    directive.handleError();

    expect(imgElement.src).toContain('fallback.jpg');
  });
});
