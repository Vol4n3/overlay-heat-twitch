import {Scene2d, Scene2DItem} from '../core/scene2d';
import {Circle2} from '../geometry/circle2';
import {Vector2} from '../geometry/vector2';
import {createEasing, Easing, EasingCallback} from '../../utils/easing.utils';
import {AngleFlip, AngleKeepRange} from '../../utils/number.utils';
import {CanCollide} from '../core/collider';
import {Asteroid} from './asteroid';

const rotationSpeed = 50;

export class Starship extends Circle2 implements Scene2DItem, CanCollide {

  constructor(x: number, y: number, public owner: string = "",
              private onDestroyed: (asteroidOwner: string) => void) {
    super(x, y, 25);
  }

  collisionId: number = 0;

  destructionTime: number = 0;
  origin: Vector2 | null = null;
  rotation = 0;

  detection(item: CanCollide) {
    if (item instanceof Asteroid) {
      this.collideToAsteroid(item);
    }
  }

  sceneId: number = 0;

  draw({ctx}: Scene2d, time: number): void {
    ctx.translate(-this.radius, -this.radius);
    ctx.translate(this.position.x, this.position.y)
    ctx.translate(this.radius, this.radius);
    ctx.rotate(this.rotation);
    ctx.translate(-this.radius, -this.radius);
    ctx.fillStyle = "rgba(255,0,0,0.5)";
    if (this.isDestroyed) {
      ctx.save();
      //partie haute
      ctx.translate(0, -this.destructionTime);
      ctx.rotate(this.destructionTime * 0.01)
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.radius * 2, this.radius);
      ctx.lineTo(this.radius / 2, this.radius);
      ctx.fill();
      ctx.closePath();

      ctx.restore();
      // partie basse
      ctx.save();
      ctx.translate(0, this.destructionTime);
      ctx.rotate(this.destructionTime * -0.01)
      ctx.beginPath();
      ctx.moveTo(0, this.radius * 2);
      ctx.lineTo(this.radius * 2, this.radius);
      ctx.lineTo(this.radius / 2, this.radius);
      ctx.fill();
      ctx.closePath();
      ctx.restore();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(this.radius * 2, this.radius);
      ctx.lineTo(0, this.radius * 2);
      ctx.lineTo(this.radius / 2, this.radius);
      ctx.fill();
      ctx.closePath();
    }


    if (this.rotation < (-Math.PI / 2) || this.rotation > (Math.PI / 2)) {
      ctx.translate(this.radius * 2, this.radius * 2);
      ctx.scale(-1, -1);

    }
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "26px Arial";
    ctx.fillText(this.owner, this.radius, this.radius);
  }

  update(scene: Scene2d, time: number): void {
    const {ctx} = scene;
    const {width, height} = ctx.canvas;
    if (this.isDestroyed) {
      this.destructionTime++;
      return;
    }
    this.position.operation("add", this.direction)
    this.position.teleportBoundary(
      0 - this.radius,
      width + this.radius,
      0 - this.radius,
      height + this.radius);
    this.direction = Vector2.createFromAngle(this.rotation, 4);

    if (this.target) {
      //const vectorDestination = this.target.createFromDiff(this.position);
      const destination = this.position.angleTo(this.target);
      const travel = destination - this.rotation;
      this.easingRotation = createEasing(
        Easing.easeInOutCubic,
        this.rotation,
        Math.abs(travel) >= Math.PI ? AngleFlip(destination) : destination,
        rotationSpeed
      )
      this.target = null;
    }
    if (this.easingRotation !== null) {
      const nextRotation = this.easingRotation();
      if (nextRotation === null) {
        this.easingRotation = null;
        return;
      }
      this.rotation = AngleKeepRange(nextRotation);
    }
  }

  scenePriority: number = 0;
  target: Vector2 | null = null;
  private easingRotation: EasingCallback | null = null;
  private isDestroyed: boolean = false;

  collideToAsteroid(asteroid: Asteroid) {
    const vectorCheck = this.position.distanceTo(asteroid.position);
    if (vectorCheck < (this.radius + asteroid.radius)) {
      this.destroyBy(asteroid.owner);
    }
  }

  destroyBy(name: string) {
    this.isDestroyed = true;
    setTimeout(() => {
      this.onDestroyed(name);
    }, 1000)
  }

  isTouched(): void {
    this.owner = "";
    this.direction = new Vector2(0, 0);
  }

}