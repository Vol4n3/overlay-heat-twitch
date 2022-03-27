import {VectorLength} from '../../utils/vector.utils';
import {numberRange} from '../../utils/number.utils';

export class Vector2 {
  get angle(): number {
    return Math.atan2(this.y, this.x);
  }

  set angle(angle) {
    const length = this.length;
    this.translate(Math.cos(angle) * length, Math.sin(angle) * length)
  }

  get length(): number {
    return VectorLength([this.x, this.y]);
  }

  constructor(public x: number, public y: number) {
  }

  static createFromAngle(angle: number, length: number): Vector2 {
    return new Vector2(Math.cos(angle) * length, Math.sin(angle) * length)
  }

  createFromVectorDiff(vector: Vector2) {
    return new Vector2(this.x - vector.x, this.y - vector.y)
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

  translate(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  translateFrom(vector: Vector2) {
    this.translate(vector.x, vector.y);
  }
}