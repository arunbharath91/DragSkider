import { Debounce } from "./helper";

interface IOptions {
  threshold?: number;
  gap?: number,
  transition?: boolean;
}

const defaultOptions: IOptions = {
  threshold: 2,
  gap: 12,
  transition: false
}

export class DragSlider {
  private selector!: HTMLElement;
  private childSelector!: HTMLElement;
  private isDown = false;
  private scrollX!: number;
  private scrollLeft!: number;
  private options: IOptions;

  private leftOverlay!: HTMLElement;
  private rightOverlay!: HTMLElement;
  private dragNav!: HTMLElement;

  public singleItemWidth!: number;
  constructor(selector: string, options?: IOptions) {
    this.options = { ...defaultOptions, ...options, };
    this.selector = document.querySelector(selector) as HTMLElement;
    this.childSelector = this.selector.querySelector('.drag-slider') as HTMLElement;

    // const ifImgFound = (this.childSelector.querySelector('.item > img') as HTMLElement);
    // if (ifImgFound) {
    //   ifImgFound.addEventListener('load', (e: any) => {
    //     if(e.target.complete) {
    //       this.init();
    //     }   
    //   }, false);
    // } else {
    //   this.init();
    // }


    this.init()
  }

  private init() {
    setTimeout(() => {
      this.singleItemWidth = (this.childSelector.querySelector('.item') as HTMLElement).offsetWidth;
      Array.prototype.slice.call(this.childSelector.querySelectorAll('.item')).forEach((item: HTMLElement) => {
        item.style.width = `${this.singleItemWidth}px`
        item.style.setProperty('--gap', `${this.options.gap}px`)
      });

      this.projectControlElements();
      this.eventRegistration();
      this.controlVisibility();
    }, 1500)

  }

  private projectControlElements() {
    this.leftOverlay = document.createElement('span');
    this.leftOverlay.className = 'scroll-overlay left';
    this.rightOverlay = document.createElement('span');
    this.rightOverlay.className = 'scroll-overlay right';
    this.selector.append(this.leftOverlay);
    this.selector.prepend(this.rightOverlay);

    this.dragNav = document.createElement('div');
    this.dragNav.className = 'drag-nav';
    this.dragNav.insertAdjacentHTML('afterbegin', '<div class="left-nav"></div><div class="right-nav"></div>');
    this.selector.prepend(this.dragNav);

  }

  private eventRegistration(): void {
    // Mouse Up Function
    this.childSelector.addEventListener("mouseup", () => {
      this.isDown = false;
      this.childSelector.classList.remove("active");
    });

    // Mouse Leave Function
    this.childSelector.addEventListener("mouseleave", () => {
      this.isDown = false;
      this.childSelector.classList.remove("active");
    });

    // Mouse Down Function
    this.childSelector.addEventListener("mousedown", (e) => {
      e.preventDefault();
      this.isDown = true;
      this.childSelector.classList.add("active");
      scrollX = e.pageX - this.childSelector.offsetLeft;
      this.scrollLeft = this.childSelector.scrollLeft;
    });

    // Mouse Move Function
    this.childSelector.addEventListener("mousemove", (e) => {
      if (!this.isDown) return;
      e.preventDefault();
      console.log('trigger')
      const element = e.pageX - this.childSelector.offsetLeft;
      const scrolling = (element - scrollX) * ((this.options.threshold) ? this.options.threshold : 2);
      this.childSelector.scrollLeft = this.scrollLeft - scrolling;
    });

    this.dragNav.addEventListener('click', (e: any) => {
      if (e.target.className == 'right-nav') {
        this.childSelector.scrollLeft += this.singleItemWidth
      } else if (e.target.className == 'left-nav') {
        this.childSelector.scrollLeft -= this.singleItemWidth;
      }
    });

    this.childSelector.addEventListener("scroll", () => { this.controlVisibilityDebounce() });

  }
  @Debounce(50)
  controlVisibilityDebounce() {
    this.controlVisibility()
  }


  private controlVisibility() {
    if (this.childSelector.scrollLeft === 0) {
      this.leftControlVisibility(false);
    } else {
      this.leftControlVisibility(true);
    }
    if (
      this.childSelector.scrollLeft ===
      this.childSelector.scrollWidth - this.childSelector.clientWidth
    ) {
      this.rightControlVisibility(false);
    } else {
      this.rightControlVisibility(true);
    }
  }

  private leftControlVisibility(visible: boolean) {
    this.leftOverlay.style.opacity = visible ? '1' : '0';
    const leftNav = this.dragNav.querySelector('.left-nav') as HTMLElement;
    (visible) ? leftNav.classList.remove('disabled') : leftNav.classList.add('disabled');
  };
  private rightControlVisibility(visible: boolean) {
    this.rightOverlay.style.opacity = visible ? '1' : '0';
    const righttNav = this.dragNav.querySelector('.right-nav') as HTMLElement;
    (visible) ? righttNav.classList.remove('disabled') : righttNav.classList.add('disabled');
  };


}
