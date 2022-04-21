import {IPoint2} from '../../types/point.types';
import {Point2} from './point2';
import {Segment2} from './segment2';

export class Vector2 implements IPoint2 {

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public b: Point2 = new Point2();
  private a: Point2 = new Point2();

  get angle(): number {
    return this.a.angleTo(this.b);
  }

  set angle(angle) {
    const length = this.length;
    this.b.operation('add', Math.cos(angle) * length, Math.sin(angle) * length)
  }

  get length(): number {
    return this.a.distanceTo(this.b);
  }

  set length(len: number) {
    const angle = this.angle;
    this.x = Math.cos(angle) * len
    this.y = Math.sin(angle) * len
  }

  get x(): number {
    return this.b.x
  }

  set x(n: number) {
    this.b.x = n;
  }

  static createFromAngle(angle: number, length: number): Vector2 {
    return new Vector2(Math.cos(angle) * length, Math.sin(angle) * length);
  }

  copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  createFromDiff(p: IPoint2) {
    return new Vector2(this.x - p.x, this.y - p.y)
  }

  normalized(): Vector2 {
    const len = this.length;
    return new Vector2(this.x / len, this.y / len);
  }
  wedge(v: IPoint2): number{
    return this.x * v.y - this.y * v.x;
  }
  opposite(): Vector2 {
    return new Vector2(-this.y, -this.x);
  }

  perp(): Vector2 {
    return new Vector2(-this.y, this.x);
  }

  toSegment(origin: IPoint2): Segment2 {
    return new Segment2(origin, {x: origin.x + this.b.x, y: origin.y + this.b.y})
  }

  withLength(size: number): Vector2 {
    const angle = this.angle;
    return new Vector2(Math.cos(angle) * size, Math.sin(angle) * size)
  }

  set y(n: number) {
    this.b.y = n;
  }


  get y(): number {
    return this.b.y
  }
}