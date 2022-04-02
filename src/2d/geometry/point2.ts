import {numberRange} from '../../utils/number.utils';
import {VectorLength} from '../../utils/vector.utils';
import {DotProductName} from '../../types/point.types';

export class Point2 {
  constructor(public x: number, public y: number) {
  }

  angleFrom(p: Point2): number {
    return Math.atan2(this.y - p.y, this.x - p.y);
  }

  angleTo(p: Point2): number {
    return Math.atan2(p.y - this.y, p.y - this.x);
  }

  copy(): Point2 {
    return new Point2(this.x, this.y);
  }

  distanceTo(p: Point2): number {
    return VectorLength([this.x - p.x, this.y - p.y]);
  }

  operation<T extends Point2 | number>(type: DotProductName, p: T, y?: T extends number ? number : undefined) {
    if (typeof p === 'number') {
      if (typeof y === 'number') {
        this._operation(type, p, y);
      } else {
        this._operation(type, p, p);
      }
    } else {
      this._operation(type, p.x, p.y);
    }
  }

  setRange(xMin: number, xMax: number, yMin: number, yMax: number) {
    this.x = numberRange(this.x, xMin, xMax);
    this.y = numberRange(this.y, yMin, yMax);
  }

  teleportBoundary(xMin: number, xMax: number, yMin: number, yMax: number) {
    this.x = this.x > xMax ? xMin : this.x;
    this.x = this.x < xMin ? xMax : this.x;
    this.y = this.y > yMax ? yMin : this.y;
    this.y = this.y < yMin ? yMax : this.y;
  }

  private _operation(type: DotProductName, x: number, y: number) {
    switch (type) {
      case 'equal':
        this.x = x;
        this.y = y;
        break;
      case 'add':
        this.x += x;
        this.y += y;
        break;
      case 'divide':
        this.x /= x;
        this.y /= y;
        break;
      case 'multiply':
        this.x *= x;
        this.y *= y;
        break;
      case 'subtract':
        this.x -= x;
        this.y -= y;
        break;
    }
  }
}