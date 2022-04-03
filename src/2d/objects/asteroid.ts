import {Circle2} from '../geometry/circle2';
import {Scene2d, Scene2DItem} from '../core/scene2d';
import {Vector2} from '../geometry/vector2';
import {Starship} from './starship';
import {Perlin} from '../../utils/perlin.utils';
import {createEasing, Easing, EasingCallback} from '../../utils/easing.utils';

const img = new Image();
let loaded = false;
img.onload = () => {
  loaded = true;
}
img.src = "/overlay-heat-twitch/assets/texture_asteroid.jpg";


export class Asteroid extends Circle2 implements Scene2DItem {
  constructor(x: number, y: number, private starship: Starship, private owner: string, private touchedListener: Function, direction: Vector2) {
    super(x, y, 1);
    this.direction = direction;
    this.rotation = Math.random() * 2 * Math.PI;
    this.rotationSpeed = (Math.random() * 2 - 1) / 50;
  }

  private easingGrow: EasingCallback | null = createEasing(Easing.easeInCubic, 1, 60, 30);
  private perlin = new Perlin();
  private texture: null | CanvasPattern = null;

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
    this.rotation += this.rotationSpeed;
    this.position.operation('add', this.direction);
    this.position.teleportBoundary(0, width, 0, height);
    const vectorCheck = this.position.distanceTo(this.starship.position);
    if (vectorCheck < (this.radius + this.starship.radius)) {
      this.starship.isTouched();
      if (this.touchedListener) {
        this.touchedListener();
      }
    }
  }
}