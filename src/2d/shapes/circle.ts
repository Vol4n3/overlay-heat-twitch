import {Vector2} from '../geometry/vector2';


export class Circle {
  public rotation: number = 0;
  public velocity: Vector2 = new Vector2(0, 0);
  public position: Vector2;

  constructor(x: number, y: number, public radius: number) {
    this.position = new Vector2(x, y);
  }

  bounceBoundary(xMin: number, xMax: number, yMin: number, yMax: number) {
    if (this.position.x > xMax || this.position.x < xMin) {
      this.velocity.x *= -1
      if (this.position.x > xMax) {
        this.position.x = xMax
      }
      if (this.position.x < xMin) {
        this.position.x = xMin
      }
    }
    if (this.position.y > yMax || this.position.y < yMin) {
      this.velocity.y *= -1
      if (this.position.y > yMax) {
        this.position.y = yMax
      }
      if (this.position.y < yMin) {
        this.position.y = yMin
      }
    }
  }
}