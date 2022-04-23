import {Vector2} from '../geometry/vector2';
import {Point2} from '../geometry/point2';
import {IPoint2} from '../../types/point.types';
import {Rectangle2} from '../geometry/rectangle2';
import {Circle2} from '../geometry/circle2';
import {Item2Scene, Scene2d} from '../core/scene2d';
import {AngleKeepRange, PI2} from '../../utils/number.utils';
import {Segment2} from '../geometry/segment2';

/**
 * @deprecated
 */
export class OldPhysicBall2 extends Circle2 implements Item2Scene {
  isUpdated: boolean = true;
  constructor(x: number, y: number, radius: number) {
    super(x, y, radius);
    this.position = new Point2(x, y);
  }

  public rotation = 0;
  public friction: Point2 = new Point2(0.999, 0.999);
  public gravity: Point2 = new Point2(0, 0);
  public isStatic: boolean = false;
  public mass: number = 1;
  public position: Point2;
  public rotationSpeed: number = 0;
  public isGrounded: boolean = false;
  sceneId: number = 0;
  scenePriority: number = 0;

  draw2d(scene: Scene2d, time: number): void {
    const {ctx} = scene;
    ctx.translate(this.position.x, this.position.y)
    ctx.rotate(this.rotation);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, PI2);
    ctx.fillStyle = "green";
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.closePath();
  }

  update(scene: Scene2d, time: number): void {
  }

  public velocity: Vector2 = new Vector2(0, 0);

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

  applyPhysics() {
    this.velocity.b.operation('multiply', this.friction);
    if (Math.abs(this.velocity.x) < 0.01) {
      this.velocity.x = 0
    }
    if (Math.abs(this.velocity.y) < 0.01) {
      this.velocity.y = 0;
    }
    if (!this.isGrounded) {
      this.velocity.b.operation('add', this.gravity);
    }
    this.position.operation("add", this.velocity);
    this.rotation =  AngleKeepRange(this.rotation + this.rotationSpeed);
  }

  bounceBoundary(rect: Rectangle2, bounceStrength: IPoint2 = {x: 1, y: 1}): string {
    let isBounce = "";
    if (this.position.x > rect.w || this.position.x < rect.x) {
      if ((this.position.x > rect.w && this.velocity.x >= 0) || (this.position.x < rect.x && this.velocity.x <= 0)) {
        this.velocity.x *= -bounceStrength.x;
        this.velocity.y *= bounceStrength.y;
      }
      isBounce = "x";
    }
    if (this.position.y > rect.h || this.position.y < rect.y) {
      if ((this.position.y > rect.h && this.velocity.y >= 0) || (this.position.y < rect.y && this.velocity.y <= 0)) {
        this.velocity.y *= -bounceStrength.y;
        this.velocity.x *= bounceStrength.x;
      }
      this.rotationSpeed = this.velocity.x / 40;
      isBounce = "y";
    }
    return isBounce
  }

  get projectedVelocitySegment(): Segment2 {
    const displacement = this.position.createWithDirection(this.velocity.angle, this.radius);
    return this.velocity.toSegment(displacement);
  }

  circleCollisionResponse(other: OldPhysicBall2): void {

    if (this.isGrounded || other.isGrounded) {
      this.isGrounded = true;
      other.isGrounded = true;
    }
    const intersect = new Vector2(other.x - this.x, other.y - this.y);
    const distance = intersect.length;
    const normalized = intersect.normalized();
    // separate the two circles after intersection (static response)
    const overlap = 0.5 * (distance - this.radius - other.radius);
    if (!this.isStatic) {
      this.x -= overlap * (this.x - other.x) / distance;
      this.y -= overlap * (this.y - other.y) / distance;
    }
    if (!other.isStatic) {
      other.x += overlap * (this.x - other.x) / distance;
      other.y += overlap * (this.y - other.y) / distance;
    }
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
      this.rotationSpeed = this.velocity.x / 40;

    }

    if (!other.isStatic) {
      other.velocity.x = (tanVec.x * dpTan2 + normalized.x * m2) * 0.99;
      other.velocity.y = (tanVec.y * dpTan2 + normalized.y * m2) * 0.99;
      other.rotationSpeed = other.velocity.x / 40;
    }

  }

  isCollisionToCircle(circle: OldPhysicBall2): boolean {
    return this.position.distanceTo(circle) < (this.radius + circle.radius)
  }
}