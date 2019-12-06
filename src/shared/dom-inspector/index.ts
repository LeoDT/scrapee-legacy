import throttle from 'lodash/throttle';

export class DOMInspector {
  doc: Document;

  maskRoot: HTMLDivElement;
  focusMask: HTMLDivElement;

  focused: HTMLElement | null = null;

  constructor(root: Document) {
    this.doc = root;

    this.maskRoot = root.createElement('div');
    this.maskRoot.setAttribute('id', 'scrapee-mask-root');
    Object.assign(this.maskRoot.style, {
      position: 'fixed',
      zIndex: 99999,
      top: 0,
      left: 0
    });

    this.focusMask = this.generateMask();
  }

  mount(): void {
    if (this.doc.body) {
      this.doc.body.appendChild(this.maskRoot);
    }

    document.addEventListener('mousemove', this.handleMouseMove);
  }

  unmount(): void {
    if (this.doc.body) {
      this.focusMask.style.height = '0px';
      this.doc.body.removeChild(this.maskRoot);
    }

    document.removeEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseMove = throttle((e: MouseEvent): void => {
    const els = this.doc.elementsFromPoint(e.x, e.y) as HTMLElement[];

    const el = els.find(e => !this.isMaskEl(e));

    if (el && this.focused !== el) {
      this.setFocus(el);
    }
  }, 33);

  isMaskEl(el: HTMLElement): boolean {
    return Boolean(el.dataset.scrapeeMask);
  }

  setFocus(el: HTMLElement): void {
    this.focused = el;
    this.attachMask(this.focusMask, this.focused);
  }

  generateMask(): HTMLDivElement {
    const mask = this.doc.createElement('div');

    mask.dataset.scrapeeMask = 'true';

    Object.assign(mask.style, {
      backgroundColor: '#333',
      border: '1px solid #000',
      opacity: 0.3,
      zIndex: 999999
    });

    this.maskRoot.appendChild(mask);

    return mask;
  }

  attachMask(mask: HTMLElement, el: HTMLElement): void {
    const rect = el.getBoundingClientRect();

    const isFixed = getComputedStyle(el).position === 'fixed';

    Object.assign(mask.style, {
      position: isFixed ? 'fixed' : 'absolute',
      left: `${Math.floor(rect.left)}px`,
      top: `${Math.floor(rect.top)}px`,
      height: `${Math.floor(rect.height)}px`,
      width: `${Math.floor(rect.width)}px`
    });
  }
}
