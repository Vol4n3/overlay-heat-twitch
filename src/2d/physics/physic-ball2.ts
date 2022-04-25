import {Circle} from 'detect-collisions';
import {Point2} from '../geometry/point2';
import {Vector2} from '../geometry/vector2';
import {ItemSystem} from '../core/scene2d';
import {IPoint2} from '../../types/point.types';
import {AngleKeepRange} from '../../utils/number.utils';
import {Rectangle2} from '../geometry/rectangle2';
import {PhysicWall2} from './physic-wall2';
import {Segment2} from '../geometry/segment2';
import {PointDistance, PointsSum} from '../../utils/point.utils';

export class PhysicBall2 extends Circle implements ItemSystem {
  public forces: IPoint2[] = [];
  public friction: IPoint2 = {x: 1, y: 1};
  public gravity: IPoint2 = {x: 0, y: 0};
  public isGrounded: "x" | "y" | null = null;
  public mass = 1;
  public rotation = 0;
  public rotationFriction: number = 0.99;
  public rotationSpeed: number = 0;
  public velocity: Vector2 = new Vector2(0, 0);

  get projectedVelocitySegment(): Segment2 {
    const displacement = new Point2(this.x, this.y).createWithDirection(this.velocity.angle, this.r);
    return this.velocity.toSegment(displacement);
  }

  applyPhysics() {
    this.velocity.b.operation('add', PointsSum(this.forces));
    this.velocity.b.operation('multiply', this.friction);
    this.forces = [this.gravity];
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
      this.forces.push({x: 0, y: -this.gravity.y})
    }
  }

  isCollide(other: ItemSystem, overlapV: IPoint2, overlapN: IPoint2): void {
    if (other instanceof PhysicWall2) {
      this.wallResponse(other, overlapV, overlapN);
      return;
    }
    if (other instanceof PhysicBall2) {
      if (!this.isStatic) {
        this.setPosition(this.pos.x - overlapV.x, this.pos.y - overlapV.y);
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

  wallResponse(wall: PhysicWall2, overlapV: IPoint2, overlapN: IPoint2): void {
    if (this.isStatic) {
      return
    }
    this.setPosition(this.pos.x - overlapV.x, this.pos.y - overlapV.y);
    const segment = wall.segment;
    const support = segment.toOppositeVector().perp();
    support.length = PointDistance(this.gravity);
    this.forces.push(support)
  }
}