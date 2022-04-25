import {OldPhysicBall2} from '../../2d/physics/old-physic-ball2';
import {Item2Scene, Scene2d} from '../../2d/core/scene2d';
import {CanCollide} from '../../2d/core/collider';
import {createEasing, Easing, EasingCallback} from '../../utils/easing.utils';
import {AngleFlip, AngleKeepRange, HALF_PI, PI, PI2} from '../../utils/number.utils';
import {Vector2} from '../../2d/geometry/vector2';
import {Point2} from '../../2d/geometry/point2';
import {SoccerBall} from './soccerBall';

export class PlayerSoccer extends OldPhysicBall2 implements Item2Scene, CanCollide {
  collisionId: number = 0;
  isUpdated: boolean = true;
  target: null | Vector2 = null;

  easingMovement: EasingCallback | null = null;
  easingRotation: EasingCallback | null = null;
  originalPosition: Point2 = this.position;
  owner: string = "";
  sceneId: number = 0;
  scenePriority: number = 0;
  team: string = "";

  update(scene: Scene2d, time: number): void {
    this.isUpdated = true;
    this.position.operation('add', this.velocity);
    this.velocity.b.operation("multiply", 0.8);
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
          this._movement = new Vector2(copy.x - this.position.x, copy.y - this.position.y);
          this.position = copy;
        }
      }
    }
  }

  private _movement: Vector2 | null = null;

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
    if (item instanceof SoccerBall) {
      const collision = this.isCollisionToCircle(item);
      if (collision) {
        item.playerShoot(this);
      }
      return;
    }
  }

  draw2d(scene2d: Scene2d, time: number): void {
    const {ctx} = scene2d;
    ctx.translate(this.position.x, this.position.y)
    ctx.rotate(this.rotation);
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius + 10, this.radius - 10, HALF_PI, 0, PI2);
    ctx.fillStyle = this.team;
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(this.radius / 4, 0, this.radius / 2, 0, PI2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.closePath();
    if (this.rotation < (-HALF_PI) || this.rotation > HALF_PI) {
      ctx.scale(-1, -1);

    }
    scene2d.writeText({
      x: 0,
      y: 0,
      textAlign: "center",
      textBaseline: "middle",
      text: this.owner,
      fillStyle: "white"
    })
  }

  setTarget(point: Point2) {
    this.target = new Vector2(point.x - this.position.x, point.y - this.position.y);
    this.originalPosition = this.position;
    const destination = this.target.angle;
    const travel = destination - this.rotation;
    this.easingRotation = createEasing(
      Easing.easeInOutCubic,
      this.rotation,
      Math.abs(travel) >= PI ? AngleFlip(destination) : destination,
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