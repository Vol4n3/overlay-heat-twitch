import {Vector2} from './vector2';
import {Point2} from './point2';


export class Circle2 {
  public velocity: Vector2 = new Vector2(0, 0);
  public rotationSpeed: number = 0;

  constructor(x: number, y: number, public radius: number) {
    this.position = new Point2(x, y);
  }

  public rotation: number = 0;
  public position: Point2;

  get x(): number {
    return this.position.x;
  }

  set x(n: number) {
    this.position.x = n;
  }

  get y(): number {
    return this.position.y;
  }

  set y(n: number) {
    this.position.y = n;
  }

  bounceBoundary(xMin: number, xMax: number, yMin: number, yMax: number) {
    if (this.position.x > xMax || this.position.x < xMin) {
      if ((this.position.x > xMax && this.velocity.x > 0) || (this.position.x < xMin && this.velocity.x < 0)) {
        this.velocity.x *= -1
      }
    }
    if (this.position.y > yMax || this.position.y < yMin) {
      if ((this.position.y > yMax && this.velocity.y > 0) || (this.position.y < yMin && this.velocity.y < 0)) {
        this.velocity.y *= -1
      }
    }
  }

  isCollisionToCircle(circle: Circle2): null | Point2 {
    if (this.position.distanceTo(circle) < (this.radius + circle.radius)) {
      return new Point2(0, 0);
    }
    return null
  }
}