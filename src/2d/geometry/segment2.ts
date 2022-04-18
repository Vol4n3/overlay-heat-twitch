import {IPoint2} from '../../types/point.types';
import {Vector2} from './vector2';

export class Segment2 {
  constructor(public p1: IPoint2, public p2: IPoint2) {
  }

  get center(): IPoint2 {
    return {
      x: (this.p1.x + this.p2.x) / 2,
      y: (this.p1.y + this.p2.y) / 2
    }
  }

  interpolation(t: number): IPoint2 {
    return {
      x: t * this.p2.x + (1 - t) * this.p1.x,
      y: t * this.p2.y + (1 - t) * this.p1.y,
    }
  }

  interpolationLength(distance: number): IPoint2 {
    const vectLength = new Vector2(this.p1.x - this.p2.x, this.p1.y - this.p2.y).length;
    if (vectLength === 0) {
      return {x: this.p1.x, y: this.p1.y}
    }
    return this.interpolation(distance / vectLength)
  }

  intersect(segment: Segment2, projection?: boolean): IPoint2 | null {
    const ip = this.intersectLineTo(segment);
    if (ip === null) {
      return null;
    }
    if (projection) {
      return ip;
    }
    const rx0 = (ip.x - this.p1.x) / (this.p2.x - this.p1.x),
      ry0 = (ip.y - this.p1.y) / (this.p2.y - this.p1.y),
      rx1 = (ip.x - segment.p1.x) / (segment.p2.x - segment.p1.x),
      ry1 = (ip.y - segment.p1.y) / (segment.p2.y - segment.p1.y);
    if (((rx0 >= 0 && rx0 <= 1) || (ry0 >= 0 && ry0 <= 1)) &&
      ((rx1 >= 0 && rx1 <= 1) || (ry1 >= 0 && ry1 <= 1))) {
      return ip;
    } else {
      return null
    }

  }

  intersectLineTo(segment: Segment2): IPoint2 | null {
    const A1 = this.p2.y - this.p1.y,
      B1 = this.p1.x - this.p2.x,
      C1 = A1 * this.p1.x + B1 * this.p1.y,
      A2 = segment.p2.y - segment.p1.y,
      B2 = segment.p1.x - segment.p2.x,
      C2 = A2 * segment.p1.x + B2 * segment.p1.y,
      denominator = A1 * B2 - A2 * B1;
    if (denominator === 0) {
      return null
    }
    return {x: (B2 * C1 - B1 * C2) / denominator, y: (A1 * C2 - A2 * C1) / denominator};
  }
}
