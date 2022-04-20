import {IPoint2} from '../../types/point.types';
import {Vector2} from './vector2';
import {Item2Scene, Scene2d} from '../core/scene2d';
import {Circle2} from './circle2';
import {AngleTo, PointDistance} from '../../utils/point.utils';
import {AngleKeepRange, PI2} from '../../utils/number.utils';


export class Segment2 implements Item2Scene {
  constructor(public p1: IPoint2, public p2: IPoint2) {
  }

  sceneId: number = 0;
  scenePriority: number = 0;

  draw2d(scene: Scene2d, time: number): void {
    const {ctx} = scene;
    ctx.beginPath();
    ctx.moveTo(this.p1.x, this.p1.y);
    ctx.lineTo(this.p2.x, this.p2.y);
    ctx.lineWidth = 3;
    ctx.fillStyle = "black"
    ctx.stroke()
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(this.p1.x, this.p1.y, 5, 0, PI2);
    ctx.fillStyle = "red";
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.closePath();

    ctx.beginPath();
    ctx.arc(this.p2.x, this.p2.y, 5, 0, PI2);
    ctx.fillStyle = "red";
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.closePath();
  }

  update(scene: Scene2d, time: number): void {
  }

  get center(): IPoint2 {
    return {
      x: (this.p1.x + this.p2.x) / 2,
      y: (this.p1.y + this.p2.y) / 2
    }
  }

  get backwardAngle(): number {
    return AngleTo(this.p1, this.p2)
  }

  get forwardAngle(): number {
    return AngleTo(this.p2, this.p1)
  }

  get length(): number {
    const dx = this.p1.x - this.p2.x;
    const dy = this.p1.y - this.p2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  collideCircle(circle: Circle2): IPoint2 | null {

    const side1 = PointDistance(this.p1, circle);
    const side2 = PointDistance(this.p2, circle);
    if (circle.radius > side1) {
      return {
        x: this.p1.x,
        y: this.p1.y
      }
    }
    if (circle.radius > side2) {
      return {
        x: this.p2.x,
        y: this.p2.y
      }
    }
    const lerp = this.perpendicularLinePoint(circle)
    if (!this.collidePoint(lerp)) return null;
    const distance = PointDistance(lerp, circle);

    return distance <= circle.radius ? lerp : null;

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

  collidePoint(point: IPoint2): boolean {
    const d1 = PointDistance(point, this.p1);
    const d2 = PointDistance(point, this.p2);
    const lineLen = this.length;
    const buffer = 0.1;
    return d1 + d2 >= lineLen - buffer && d1 + d2 <= lineLen + buffer;
  }

  perpendicularLinePoint(other: IPoint2): IPoint2 {
    const len = this.length;
    const dot = (((other.x - this.p1.x) * (this.p2.x - this.p1.x)) + ((other.y - this.p1.y) * (this.p2.y - this.p1.y))) / (len * len);

    return {x: this.p1.x + (dot * (this.p2.x - this.p1.x)), y: this.p1.y + (dot * (this.p2.y - this.p1.y))}
  }

  reflectionAngle(face: number): number {
    return AngleKeepRange(this.backwardAngle + (face - this.forwardAngle) * 2);
  }

  reflectionToCircle(circle: Circle2, projection?: boolean): Segment2 | null {
    if (!projection) {
      if (!this.collideCircle(circle)) {
        return null;
      }
    }
    const perpPoint = this.perpendicularLinePoint(circle);
    const h = PointDistance(perpPoint, circle);
    const adjacent = Math.sqrt(circle.radius * circle.radius - h * h);
    const vect = Vector2.createFromAngle(this.forwardAngle, adjacent);
    const oposite = vect.toSegment(perpPoint);
    const residu = PointDistance(oposite.p2, this.p2);
    if (residu > this.length) {
      return null;
    }
    const angle = this.reflectionAngle(new Segment2(circle, oposite.p2).toVector().perp().angle)
    return Vector2.createFromAngle(angle, residu).toSegment(oposite.p2);
  }

  reflectionToSegment(other: Segment2, projection?: boolean): Segment2 | null {
    const point = this.intersect(other, projection);
    if (!point) {
      return null
    }
    const residu = PointDistance(point, this.p2);
    if (residu > this.length) {
      return null;
    }
    const angle = this.reflectionAngle(other.backwardAngle);
    return Vector2.createFromAngle(angle, residu).toSegment(point);
  }

  toOppositeVector(): Vector2 {
    return new Vector2(this.p1.x - this.p2.x, this.p1.y - this.p2.y)
  }

  toVector(): Vector2 {
    return new Vector2(this.p2.x - this.p1.x, this.p2.y - this.p1.y)
  }
}
