import { Point2, Size2 } from "../../01_Utils/00_Point";

type Direction = "top" | "right" | "bottom" | "left";
const directions: Direction[] = ["top", "right", "bottom", "left"];

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

  get positions(): [number, number, number, number] {
    return [this.top, this.right, this.bottom, this.left];
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

  calcSpaceWideDirection(): Direction {
    if (!(this.spaces.length > 0)) {
      throw new Error(
        "まだ親要素のサイズが決まっていないので、spaceWideDirectionを計算できません。!!ありえない状況"
      );
    }

    const maxSpace = Math.max(...this.spaces);
    const maxIndex = this.spaces.indexOf(maxSpace);
    return directions[maxIndex];
  }

  calcPositionToOpen(openingRect: SmartRect): Point2 {
    //一番あいている方向に、相手の大きさを考慮して配置
    const direction: Direction = this.calcSpaceWideDirection();
    if (!(this.spaces.length > 0)) {
      throw new Error(
        "まだ親要素のサイズが決まっていないので、spaceWideDirectionを計算できません。!!ありえない状況"
      );
    }

    if (direction === "top") {
      return {
        x: this.left,
        y: this.top - openingRect.height * 1.2,
      };
    } else if (direction === "right") {
      return {
        x: this.right + openingRect.width * 0.2,
        y: this.top,
      };
    } else if (direction === "bottom") {
      return {
        x: this.left,
        y: this.bottom + openingRect.height * 0.2,
      };
    } else if (direction === "left") {
      return {
        x: this.left - openingRect.width * 1.2, //ここは自分の幅は重要ではない。相手の幅。一旦便宜上自分の幅を使う。
        y: this.top,
      };
    }

    throw new Error("ありえない状況");
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
      spaces: [
        this.topSpace,
        this.rightSpace,
        this.bottomSpace,
        this.leftSpace,
      ],
    };
  }
}
