import {IPoint2} from '../../types/point.types';

export class Rectangle2 {

  constructor(public x: number, public y: number, public w: number, public h: number) {
  }

  get center(): IPoint2 {
    return {x: this.x + this.w / 2, y: this.y + this.h / 2};
  }

  inRange(value: number, min: number, max: number): boolean {
    return value >= Math.min(min, max) && value <= Math.max(min, max);
  }

  isInside(point: IPoint2): boolean {
    return this.inRange(point.x, this.x, this.x + this.w) && this.inRange(point.y, this.y, this.y + this.h);
  }
}