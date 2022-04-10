import {Circle2} from '../geometry/circle2';
import {Scene2d, Scene2DItem} from '../core/scene2d';
import {CanCollide} from '../core/collider';
import {createEasing, Easing, EasingCallback} from '../../utils/easing.utils';
import {AngleFlip, AngleKeepRange} from '../../utils/number.utils';
import {Vector2} from '../geometry/vector2';
import {Point2} from '../geometry/point2';
import {Ballon} from './ballon';

export class PlayerSoccer extends Circle2 implements Scene2DItem, CanCollide {
  collisionId: number = 0;

  private _movement: Vector2 | null = null;

  easingMovement: EasingCallback | null = null;
  easingRotation: EasingCallback | null = null;
  originalPosition: Point2 = this.position;
  owner: string = "";
  sceneId: number = 0;
  scenePriority: number = 0;

  draw(scene2d: Scene2d, time: number): void {
    const {ctx} = scene2d;
    ctx.translate(this.position.x, this.position.y)
    ctx.rotate(this.rotation);
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius + 10, this.radius - 10, Math.PI / 2, 0, Math.PI * 2);
    ctx.fillStyle = this.team;
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(this.radius / 4, 0, this.radius / 2, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
    scene2d.writeText({
      x: 0,
      y: 0,
      text: this.owner,
      fillStyle: "white"
    })
  }

  get calculatedVelocity(): Vector2 {

    if (this._movement === null) {
      return this.velocity;
    }
    return this._movement;
  }

  detection(item: CanCollide): void {
    if (item instanceof PlayerSoccer) {


      return;
    }
    if (item instanceof Ballon) {
      const collision = this.isCollisionToCircle(item);
      if (collision) {
        item.playerShoot(this);
      }
      return;
    }
  }

  target: null | Vector2 = null;
  team: string = "";

  update(scene: Scene2d, time: number): void {
    if (this.easingRotation !== null) {
      const nextRotation = this.easingRotation();
      if (nextRotation === null) {
        this.easingRotation = null;
        return;
      }
      this.rotation = AngleKeepRange(nextRotation);
    } else {
      if (this.easingMovement !== null) {
        const nextPosition = this.easingMovement();
        if (nextPosition === null) {
          this.easingMovement = null;
          this.target = null;
          this._movement = null;
          return;
        }
        if (this.target) {
          const copy = this.originalPosition.copy();
          copy.moveDirectionTo(this.target.angle, nextPosition);
          this._movement = new Vector2(this.position.x - copy.x, this.position.y - copy.y);
          this.position = copy;
        }
      }
    }
  }
  setTarget(point: Point2) {
    this.target = new Vector2(point.x - this.position.x, point.y - this.position.y);
    this.originalPosition = this.position;
    const destination = this.target.angle;
    const travel = destination - this.rotation;
    this.easingRotation = createEasing(
      Easing.easeInOutCubic,
      this.rotation,
      Math.abs(travel) >= Math.PI ? AngleFlip(destination) : destination,
      20
    );
    const length = this.target.length
    this.easingMovement = createEasing(
      Easing.easeInOutCubic,
      0, length,
      (Math.sqrt(length) * 4)
    );
  }
}