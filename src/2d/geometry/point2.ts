import {numberRange} from '../../utils/number.utils';
import {DotProductName, IPoint2} from '../../types/point.types';

export class Point2 implements IPoint2 {
  constructor(public x: number = 0, public y: number = 0) {
  }

  angleFrom(p: IPoint2): number {
    return Math.atan2(this.y - p.y, this.x - p.x);
  }

  angleTo(p: IPoint2): number {
    return Math.atan2(p.y - this.y, p.x - this.x);
  }

  copy(): Point2 {
    return new Point2(this.x, this.y);
  }

  distanceTo(p: IPoint2): number {
    const dx = this.x - p.x;
    const dy = this.y - p.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  dotProduct(p: IPoint2): number {
    return this.x * p.x + this.y * p.y;
  }

  operation<T extends IPoint2 | number>(type: DotProductName, p: T, y?: T extends number ? number : undefined) {
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

  moveDirectionTo(angle: number, length: number): void {
    this.x += Math.cos(angle) * length;
    this.y += Math.sin(angle) * length;
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