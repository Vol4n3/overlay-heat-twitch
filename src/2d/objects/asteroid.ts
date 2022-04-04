import {Circle2} from '../geometry/circle2';
import {Scene2d, Scene2DItem} from '../core/scene2d';
import {Vector2} from '../geometry/vector2';
import {Perlin} from '../../utils/perlin.utils';
import {createEasing, Easing, EasingCallback} from '../../utils/easing.utils';
import {CanCollide} from '../core/collider';
import {Starship} from './starship';
import {Bullet} from './bullet';

const img = new Image();
let loaded = false;
img.onload = () => {
  loaded = true;
}
img.src = "/overlay-heat-twitch/assets/texture_asteroid.jpg";


export class Asteroid extends Circle2 implements Scene2DItem, CanCollide {
  constructor(
    x: number, y: number,
    public owner: string,
    direction: Vector2) {
    super(x, y, 1);
    this.direction = direction;
    this.rotation = Math.random() * 2 * Math.PI;
    this.rotationSpeed = (Math.random() * 2 - 1) / 50;
  }

  collisionId: number = 0;

  detection(item: CanCollide) {
    if (item instanceof Starship) {
      item.collideToAsteroid(this);
      return;
    }
    if (item instanceof Bullet) {
      this.collideToBullet(item)
    }
  }

  public onDestroyed: ((starshipOwner: string) => void) | null = null;
  sceneId: number = 0;
  scenePriority: number = 0;

  draw({ctx}: Scene2d, time: number): void {

    if (this.texture === null) {
      if (loaded) {
        this.texture = ctx.createPattern(img, "repeat");
      }
    }

    ctx.translate(this.position.x, this.position.y)
    ctx.rotate(this.rotation);

    ctx.beginPath();
    const definition = 10;
    for (let i = 0; i < (Math.PI * 2) * definition; i++) {
      const cerclePerlin = Vector2.createFromAngle(i / definition, 2);
      const bruit = this.perlin.get(cerclePerlin.x, cerclePerlin.y);
      const vec = Vector2.createFromAngle(i / definition, this.radius + bruit * (this.radius / 3));
      if (i === 0) {
        ctx.moveTo(vec.x, vec.y);
      } else {
        ctx.lineTo(vec.x, vec.y);
      }
    }
    if (this.texture) {
      ctx.fillStyle = this.texture;
      ctx.globalAlpha = 0.75;
    }
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 30;
    ctx.fill();
    ctx.closePath();

    ctx.translate(-this.radius, -this.radius);
    ctx.fillStyle = "white";
    ctx.font = "26px Arial";
    ctx.fillText(this.owner, this.radius, this.radius);
  }

  update({ctx: {canvas: {width, height}}}: Scene2d, time: number): void {
    if (this.easingGrow !== null) {
      const next = this.easingGrow();
      if (next !== null) {
        this.radius = next;
        return
      }
      this.easingGrow = null;
    }
    if (this.easingDestroy !== null) {
      const next = this.easingDestroy();
      if (next !== null) {
        this.radius = next;
      } else {
        this.easingDestroy = null;
      }
    }
    this.rotation += this.rotationSpeed;
    this.position.operation('add', this.direction);
    this.position.teleportBoundary(0, width, 0, height);

  }

  private destroyerName: string | null = null;
  private easingDestroy: EasingCallback | null = null;
  private easingGrow: EasingCallback | null = createEasing(Easing.easeInCubic, 10, 60, 30);
  private perlin = new Perlin();
  private texture: null | CanvasPattern = null;

  collideToBullet(bullet: Bullet) {
    const vectorCheck = this.position.distanceTo(bullet.position);
    if (vectorCheck < (this.radius + bullet.radius)) {
      this.destroyBy(bullet.owner);
    }
  }

  destroyBy(name: string) {
    if (this.destroyerName !== null) {
      return;
    }
    this.destroyerName = name;
    this.easingDestroy = createEasing(Easing.easeOutCubic, 60, 10, 30);
    if (this.onDestroyed !== null) {
      this.onDestroyed(this.destroyerName);
    }
  }
}