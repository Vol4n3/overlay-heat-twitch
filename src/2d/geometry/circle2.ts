import {Vector2} from './vector2';
import {Point2} from './point2';


export class Circle2 {
  public direction: Vector2 = new Vector2(0, 0);
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
      if ((this.position.x > xMax && this.direction.x > 0) || (this.position.x < xMin && this.direction.x < 0)) {
        this.direction.x *= -1
      }
    }
    if (this.position.y > yMax || this.position.y < yMin) {
      if ((this.position.y > yMax && this.direction.y > 0) || (this.position.y < yMin && this.direction.y < 0)) {
        this.direction.y *= -1
      }
    }
  }
}