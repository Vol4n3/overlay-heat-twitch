import {Point2} from './point2';

export class Rectangle2 {

  get center(): Point2 {
    return new Point2(this.x + this.w / 2, this.y + this.h / 2);
  }

  constructor(public x: number, public y: number, public w: number, public h: number) {
  }
}