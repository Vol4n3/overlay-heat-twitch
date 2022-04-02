import {Point2} from './point2';

export class Segment2 {
  get center(): Point2 {
    return new Point2((this.p1.x + this.p2.x) / 2, (this.p1.y + this.p2.y) / 2)
  }

  constructor(public p1: Point2, public p2: Point2) {
  }
}