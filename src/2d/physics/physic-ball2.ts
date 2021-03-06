import {Circle} from 'detect-collisions';
import {Point2} from '../geometry/point2';
import {Vector2} from '../geometry/vector2';
import {ItemSystem} from '../core/scene2d';
import {IPoint2} from '../../types/point.types';
import {AngleKeepRange} from '../../utils/number.utils';
import {Rectangle2} from '../geometry/rectangle2';
import {CollisionWall} from './collision-wall';

export class PhysicBall2 extends Circle implements ItemSystem {
  public friction: Point2 = new Point2(1, 1);
  public groundFriction: Point2 = new Point2(0.99, 0.99);
  public gravity: Point2 = new Point2(0, 0);
  public isGrounded: "x" | "y" | null = null;
  public mass = 1;
  public rotation = 0;
  public rotationSpeed: number = 0;
  public rotationFriction: number = 0.99;
  public velocity: Vector2 = new Vector2(0, 0);

  applyPhysics() {
    this.velocity.b.operation('multiply', this.friction);
    if (this.isGrounded === 'y') {
      this.velocity.x *= this.groundFriction.x;
    } else {
        this.velocity.b.operation('add', this.gravity);
    }
    if(this.isGrounded === 'x'){
      this.velocity.y *= this.groundFriction.y;
    }
    if (Math.abs(this.velocity.x) < 0.2) {
      this.velocity.x = 0
    }
    if (Math.abs(this.velocity.y) < 0.2) {
      this.velocity.y = 0;
    }
    this.setPosition(this.x + this.velocity.x, this.y + this.velocity.y);
    this.rotation = AngleKeepRange(this.rotation + this.rotationSpeed);
    this.rotationSpeed *= this.rotationFriction;
  }

  bounceBoundary(rect: Rectangle2, bounceStrength: IPoint2 = {x: 1, y: 1}) {
    if (!(this.velocity.x === 0 && this.velocity.y === 0)) {
      this.isGrounded = null;
    }
    if (this.x >= rect.w || this.x <= rect.x) {
      if ((this.x >= rect.w && this.velocity.x > 0) || (this.x <= rect.x && this.velocity.x < 0)) {
        this.velocity.x *= -bounceStrength.x;
      }
      this.isGrounded = "x";
    }
    if (this.y >= rect.h || this.y <= rect.y) {
      if ((this.y >= rect.h && this.velocity.y > 0) || (this.y <= rect.y && this.velocity.y < 0)) {
        this.velocity.y *= -bounceStrength.y;
      }
      this.rotationSpeed = this.velocity.x / 60;
      this.isGrounded = "y";
    }
  }

  isCollide(other: ItemSystem, overlap: IPoint2): void {
    if (other instanceof CollisionWall) {

    }
    if (other instanceof PhysicBall2) {
      if (!this.isStatic) {
        this.setPosition(this.pos.x - overlap.x, this.pos.y - overlap.y);
      }
      const intersect = new Vector2(other.x - this.x, other.y - this.y);
      const normalized = intersect.normalized();
      const tanVec = normalized.perp();
      const dpTan1 = this.velocity.b.dotProduct(tanVec);
      const dpTan2 = other.velocity.b.dotProduct(tanVec);
      const dpNorm1 = this.velocity.b.dotProduct(normalized);
      const dpNorm2 = other.velocity.b.dotProduct(normalized);
      const m1 = (dpNorm1 * (this.mass - other.mass) + 2 * other.mass * dpNorm2) / (this.mass + other.mass);
      const m2 = (dpNorm2 * (other.mass - this.mass) + 2 * this.mass * dpNorm1) / (this.mass + other.mass);
      if (!this.isStatic) {
        this.velocity.x = (tanVec.x * dpTan1 + normalized.x * m1) * 0.99;
        this.velocity.y = (tanVec.y * dpTan1 + normalized.y * m1) * 0.99;
        this.rotationSpeed = this.velocity.x / 100;
      }
      if (!other.isStatic) {
        other.velocity.x = (tanVec.x * dpTan2 + normalized.x * m2) * 0.99;
        other.velocity.y = (tanVec.y * dpTan2 + normalized.y * m2) * 0.99;
        //other.rotationSpeed = normalized.wedge(other.velocity) / other.r;
      }
    }
  }
}