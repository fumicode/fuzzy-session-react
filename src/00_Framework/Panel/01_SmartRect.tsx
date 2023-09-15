interface Size2 {
  width: number;
  height: number;
}

export default class SmartRect implements DOMRectReadOnly {
  constructor(readonly domRect: DOMRectReadOnly, readonly parentSize: Size2) {}

  get x() {
    return this.domRect.x;
  }
  get y() {
    return this.domRect.y;
  }
  get width() {
    return this.domRect.width;
  }
  get height() {
    return this.domRect.height;
  }
  get top() {
    return this.domRect.top;
  }
  get right() {
    return this.domRect.right;
  }
  get bottom() {
    return this.domRect.bottom;
  }
  get left() {
    return this.domRect.left;
  }

  get topSpace() {
    return this.domRect.top - 0;
  }

  get leftSpace() {
    return this.domRect.left - 0;
  }

  get rightSpace() {
    return this.parentSize.width - this.domRect.right;
  }

  get bottomSpace() {
    return this.parentSize.height - this.domRect.bottom;
  }

  get spaces(): [number, number, number, number] {
    return [this.topSpace, this.rightSpace, this.bottomSpace, this.leftSpace];
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,

      top: this.top,
      right: this.right,
      bottom: this.bottom,
      left: this.left,

      topSpace: this.topSpace,
      rightSpace: this.rightSpace,
      bottomSpace: this.bottomSpace,
      leftSpace: this.leftSpace,
      spaces: this.spaces,
    };
  }
}
